import { useCallback, useEffect, useReducer, useRef } from 'react';
import {
  DEFAULT_ANSWER_FEEDBACK_DURATION_MS,
  FLAG_QUIZ_OPTION_COUNT,
  FLAG_QUIZ_TOTAL_ROUNDS,
  getDifficultyMultiplier,
} from '@/shared/gameplay/flag-quiz/constants/flagQuiz.constants';
import type {
  FlagQuizDifficulty,
  FlagQuizGameState,
  FlagQuizRound,
} from '@/shared/gameplay/flag-quiz/types';
import { createFlagQuizQuestions } from '@/shared/gameplay/flag-quiz/utils/createFlagQuizQuestions';
import { calculateAnswerPoints } from '@/shared/gameplay/flag-quiz/utils/flagQuizRules';
import { assertFlagDifficultyClassification } from '@/shared/gameplay/flag-quiz/utils/validateFlagDifficultyClassification';
import { FLAG_OPTIONS } from '@/shared/domain/flags';
import type { Flag } from '@/shared/domain/flags';

if (typeof __DEV__ !== 'undefined' && __DEV__) {
  assertFlagDifficultyClassification(FLAG_OPTIONS);
}

export type FlagQuizGameAction =
  | {
      readonly type: 'selectDifficulty';
      readonly difficulty: FlagQuizDifficulty;
      readonly gameId: number;
      readonly rounds: readonly FlagQuizRound[];
    }
  | { readonly type: 'answer'; readonly optionId: string }
  | { readonly type: 'advance' }
  | {
      readonly type: 'restart';
      readonly gameId: number;
      readonly rounds: readonly FlagQuizRound[];
    }
  | { readonly type: 'changeDifficulty'; readonly gameId: number };

function createScoreState() {
  return {
    currentRoundIndex: 0,
    score: 0,
    correctAnswers: 0,
    incorrectAnswers: 0,
    streak: 0,
    bestStreak: 0,
  } as const;
}

function createDifficultySelectionState(gameId: number): FlagQuizGameState {
  return {
    gameId,
    status: 'selecting-difficulty',
    rounds: [],
    ...createScoreState(),
  };
}

function createGameState(
  gameId: number,
  difficulty: FlagQuizDifficulty,
  rounds: readonly FlagQuizRound[],
): FlagQuizGameState {
  return {
    gameId,
    status: rounds.length > 0 ? 'playing' : 'unavailable',
    difficulty,
    rounds,
    ...createScoreState(),
  };
}

export function flagQuizGameReducer(
  state: FlagQuizGameState,
  action: FlagQuizGameAction,
): FlagQuizGameState {
  switch (action.type) {
    case 'selectDifficulty':
      return createGameState(action.gameId, action.difficulty, action.rounds);

    case 'answer': {
      if (state.status !== 'playing') {
        return state;
      }

      const currentRound = state.rounds[state.currentRoundIndex];
      const isKnownOption = currentRound?.options.some((option) => option.id === action.optionId);

      if (!currentRound || !isKnownOption || !state.difficulty) {
        return state;
      }

      const isCorrect = action.optionId === currentRound.correctFlag.id;
      const nextStreak = isCorrect ? state.streak + 1 : 0;
      const multiplier = getDifficultyMultiplier(state.difficulty);
      const pointsAwarded = isCorrect ? calculateAnswerPoints(nextStreak, multiplier) : 0;

      return {
        ...state,
        status: 'showing-feedback',
        score: state.score + pointsAwarded,
        correctAnswers: state.correctAnswers + (isCorrect ? 1 : 0),
        incorrectAnswers: state.incorrectAnswers + (isCorrect ? 0 : 1),
        streak: nextStreak,
        bestStreak: Math.max(state.bestStreak, nextStreak),
        selectedOptionId: action.optionId,
        feedback: {
          id: `${state.gameId}:${currentRound.id}`,
          isCorrect,
          pointsAwarded,
          correctFlag: currentRound.correctFlag,
          difficulty: state.difficulty,
          multiplier,
        },
      };
    }

    case 'advance': {
      if (state.status !== 'showing-feedback') {
        return state;
      }

      const isLastRound = state.currentRoundIndex >= state.rounds.length - 1;

      if (isLastRound) {
        return {
          ...state,
          status: 'finished',
          selectedOptionId: undefined,
          feedback: undefined,
        };
      }

      return {
        ...state,
        status: 'playing',
        currentRoundIndex: state.currentRoundIndex + 1,
        selectedOptionId: undefined,
        feedback: undefined,
      };
    }

    case 'restart': {
      if (!state.difficulty) {
        return state;
      }

      return createGameState(action.gameId, state.difficulty, action.rounds);
    }

    case 'changeDifficulty':
      return createDifficultySelectionState(action.gameId);
  }
}

function createQuestions(
  flags: readonly Flag[],
  difficulty: FlagQuizDifficulty,
  totalRounds: number,
  optionCount: number,
): FlagQuizRound[] {
  return createFlagQuizQuestions(flags, {
    totalRounds,
    optionCount,
    difficulty,
  });
}

export type UseFlagQuizGameOptions = {
  readonly flags?: readonly Flag[];
  readonly totalRounds?: number;
  readonly optionCount?: number;
  readonly feedbackDurationMs?: number;
};

export function useFlagQuizGame({
  flags = FLAG_OPTIONS,
  totalRounds = FLAG_QUIZ_TOTAL_ROUNDS,
  optionCount = FLAG_QUIZ_OPTION_COUNT,
  feedbackDurationMs = DEFAULT_ANSWER_FEEDBACK_DURATION_MS,
}: UseFlagQuizGameOptions = {}) {
  const [state, dispatch] = useReducer(flagQuizGameReducer, undefined, () =>
    createDifficultySelectionState(1),
  );
  const nextGameId = useRef(1);

  useEffect(() => {
    if (state.status !== 'showing-feedback') {
      return undefined;
    }

    const timer = setTimeout(() => {
      dispatch({ type: 'advance' });
    }, feedbackDurationMs);

    return () => clearTimeout(timer);
  }, [feedbackDurationMs, state.status, state.feedback?.id]);

  const submitAnswer = useCallback((optionId: string) => {
    dispatch({ type: 'answer', optionId });
  }, []);

  const selectDifficulty = useCallback(
    (difficulty: FlagQuizDifficulty) => {
      nextGameId.current += 1;
      dispatch({
        type: 'selectDifficulty',
        difficulty,
        gameId: nextGameId.current,
        rounds: createQuestions(flags, difficulty, totalRounds, optionCount),
      });
    },
    [flags, optionCount, totalRounds],
  );

  const restartGame = useCallback(() => {
    if (!state.difficulty) {
      return;
    }

    nextGameId.current += 1;
    dispatch({
      type: 'restart',
      gameId: nextGameId.current,
      rounds: createQuestions(flags, state.difficulty, totalRounds, optionCount),
    });
  }, [flags, optionCount, state.difficulty, totalRounds]);

  const changeDifficulty = useCallback(() => {
    nextGameId.current += 1;
    dispatch({ type: 'changeDifficulty', gameId: nextGameId.current });
  }, []);

  return {
    state,
    difficulty: state.difficulty,
    currentRound: state.rounds[state.currentRoundIndex],
    submitAnswer,
    answerCurrentRound: submitAnswer,
    selectDifficulty,
    restartGame,
    changeDifficulty,
  };
}
