import { useCallback, useEffect, useReducer, useRef } from 'react';
import {
  ANSWER_FEEDBACK_DURATION_MS,
  GUESS_FLAG_OPTION_COUNT,
  GUESS_FLAG_TOTAL_ROUNDS,
  getDifficultyMultiplier,
} from '@/features/guess-flag-game/constants/guessFlagGame.constants';
import type {
  GuessFlagDifficulty,
  GuessFlagGameState,
  GuessFlagRound,
} from '@/features/guess-flag-game/types';
import { createGuessFlagGameQuestions } from '@/features/guess-flag-game/utils/createGuessFlagGameQuestions';
import { calculateAnswerPoints } from '@/features/guess-flag-game/utils/guessFlagGameRules';
import { assertFlagDifficultyClassification } from '@/features/guess-flag-game/utils/validateFlagDifficultyClassification';
import { FLAG_OPTIONS } from '@/shared/domain/flags';
import type { Flag } from '@/shared/domain/flags';

if (typeof __DEV__ !== 'undefined' && __DEV__) {
  assertFlagDifficultyClassification(FLAG_OPTIONS);
}

export type GuessFlagGameAction =
  | {
      readonly type: 'selectDifficulty';
      readonly difficulty: GuessFlagDifficulty;
      readonly gameId: number;
      readonly rounds: readonly GuessFlagRound[];
    }
  | { readonly type: 'answer'; readonly optionId: string }
  | { readonly type: 'advance' }
  | {
      readonly type: 'restart';
      readonly gameId: number;
      readonly rounds: readonly GuessFlagRound[];
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

function createDifficultySelectionState(gameId: number): GuessFlagGameState {
  return {
    gameId,
    status: 'selecting-difficulty',
    rounds: [],
    ...createScoreState(),
  };
}

function createGameState(
  gameId: number,
  difficulty: GuessFlagDifficulty,
  rounds: readonly GuessFlagRound[],
): GuessFlagGameState {
  return {
    gameId,
    status: rounds.length > 0 ? 'playing' : 'unavailable',
    difficulty,
    rounds,
    ...createScoreState(),
  };
}

export function guessFlagGameReducer(
  state: GuessFlagGameState,
  action: GuessFlagGameAction,
): GuessFlagGameState {
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

      const isCorrect = action.optionId === currentRound.correctOptionId;
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
          correctCountryName: currentRound.correctCountryName,
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
  difficulty: GuessFlagDifficulty,
): GuessFlagRound[] {
  return createGuessFlagGameQuestions(flags, {
    totalRounds: GUESS_FLAG_TOTAL_ROUNDS,
    optionCount: GUESS_FLAG_OPTION_COUNT,
    difficulty,
  });
}

export function useGuessFlagGame(flags: readonly Flag[] = FLAG_OPTIONS) {
  const [state, dispatch] = useReducer(guessFlagGameReducer, undefined, () =>
    createDifficultySelectionState(1),
  );
  const nextGameId = useRef(1);

  useEffect(() => {
    if (state.status !== 'showing-feedback') {
      return undefined;
    }

    const timer = setTimeout(() => {
      dispatch({ type: 'advance' });
    }, ANSWER_FEEDBACK_DURATION_MS);

    return () => clearTimeout(timer);
  }, [state.status, state.feedback?.id]);

  const answerCurrentRound = useCallback((optionId: string) => {
    dispatch({ type: 'answer', optionId });
  }, []);

  const selectDifficulty = useCallback(
    (difficulty: GuessFlagDifficulty) => {
      nextGameId.current += 1;
      dispatch({
        type: 'selectDifficulty',
        difficulty,
        gameId: nextGameId.current,
        rounds: createQuestions(flags, difficulty),
      });
    },
    [flags],
  );

  const restartGame = useCallback(() => {
    if (!state.difficulty) {
      return;
    }

    nextGameId.current += 1;
    dispatch({
      type: 'restart',
      gameId: nextGameId.current,
      rounds: createQuestions(flags, state.difficulty),
    });
  }, [flags, state.difficulty]);

  const changeDifficulty = useCallback(() => {
    nextGameId.current += 1;
    dispatch({ type: 'changeDifficulty', gameId: nextGameId.current });
  }, []);

  return {
    state,
    difficulty: state.difficulty,
    currentRound: state.rounds[state.currentRoundIndex],
    answerCurrentRound,
    selectDifficulty,
    restartGame,
    changeDifficulty,
  };
}
