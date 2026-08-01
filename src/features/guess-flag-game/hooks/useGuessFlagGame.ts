import { useCallback, useEffect, useReducer, useRef } from 'react';
import { FLAG_OPTIONS } from '@/shared/domain/flags';
import type { Flag } from '@/shared/domain/flags';
import {
  ANSWER_FEEDBACK_DURATION_MS,
  GUESS_FLAG_OPTION_COUNT,
  GUESS_FLAG_TOTAL_ROUNDS,
} from '@/features/guess-flag-game/constants/guessFlagGame.constants';
import type { GuessFlagGameState, GuessFlagRound } from '@/features/guess-flag-game/types';
import { createGuessFlagGameQuestions } from '@/features/guess-flag-game/utils/createGuessFlagGameQuestions';
import { calculateAnswerPoints } from '@/features/guess-flag-game/utils/guessFlagGameRules';

type GuessFlagGameAction =
  | { readonly type: 'answer'; readonly optionId: string }
  | { readonly type: 'advance' }
  | {
      readonly type: 'restart';
      readonly gameId: number;
      readonly rounds: readonly GuessFlagRound[];
    };

function createGameState(gameId: number, rounds: readonly GuessFlagRound[]): GuessFlagGameState {
  return {
    gameId,
    status: rounds.length > 0 ? 'playing' : 'unavailable',
    rounds,
    currentRoundIndex: 0,
    score: 0,
    correctAnswers: 0,
    incorrectAnswers: 0,
    streak: 0,
    bestStreak: 0,
  };
}

export function guessFlagGameReducer(
  state: GuessFlagGameState,
  action: GuessFlagGameAction,
): GuessFlagGameState {
  switch (action.type) {
    case 'answer': {
      if (state.status !== 'playing') {
        return state;
      }

      const currentRound = state.rounds[state.currentRoundIndex];
      const isKnownOption = currentRound?.options.some((option) => option.id === action.optionId);

      if (!currentRound || !isKnownOption) {
        return state;
      }

      const isCorrect = action.optionId === currentRound.correctOptionId;
      const nextStreak = isCorrect ? state.streak + 1 : 0;
      const pointsAwarded = isCorrect ? calculateAnswerPoints(nextStreak) : 0;

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

    case 'restart':
      return createGameState(action.gameId, action.rounds);
  }
}

function createQuestions(flags: readonly Flag[]): GuessFlagRound[] {
  return createGuessFlagGameQuestions(flags, GUESS_FLAG_TOTAL_ROUNDS, GUESS_FLAG_OPTION_COUNT);
}

export function useGuessFlagGame(flags: readonly Flag[] = FLAG_OPTIONS) {
  const [state, dispatch] = useReducer(guessFlagGameReducer, undefined, () =>
    createGameState(1, createQuestions(flags)),
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

  const restartGame = useCallback(() => {
    nextGameId.current += 1;
    dispatch({
      type: 'restart',
      gameId: nextGameId.current,
      rounds: createQuestions(flags),
    });
  }, [flags]);

  return {
    state,
    currentRound: state.rounds[state.currentRoundIndex],
    answerCurrentRound,
    restartGame,
  };
}
