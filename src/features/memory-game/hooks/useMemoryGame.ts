import { useCallback, useEffect, useReducer, useRef } from 'react';
import {
  createMemoryGameDeck,
  createMemoryGameInitialState,
  MEMORY_CARD_FLIP_DURATION_MS,
  MEMORY_MISMATCH_REVEAL_DURATION_MS,
  memoryGameReducer,
  type MemoryGameDifficulty,
  type RandomSource,
} from '@/features/memory-game';
import { FLAG_OPTIONS } from '@/shared/domain/flags';
import type { Flag } from '@/shared/domain/flags';

type UseMemoryGameOptions = {
  readonly flags?: readonly Flag[];
  readonly random?: RandomSource;
  readonly mismatchRevealDurationMs?: number;
};

export function useMemoryGame({
  flags = FLAG_OPTIONS,
  random,
  mismatchRevealDurationMs = MEMORY_MISMATCH_REVEAL_DURATION_MS,
}: UseMemoryGameOptions = {}) {
  const [state, dispatch] = useReducer(memoryGameReducer, undefined, () =>
    createMemoryGameInitialState(),
  );
  const nextGameId = useRef(0);

  useEffect(() => {
    if (state.status !== 'resolving-mismatch') {
      return undefined;
    }

    const resolvingGameId = state.gameId;
    const shouldHideCards = Boolean(state.firstRevealedCardId && state.secondRevealedCardId);
    const timer = setTimeout(
      () => {
        dispatch({
          type: shouldHideCards ? 'resolve-mismatch' : 'complete-mismatch',
          gameId: resolvingGameId,
        });
      },
      Math.max(0, shouldHideCards ? mismatchRevealDurationMs : MEMORY_CARD_FLIP_DURATION_MS),
    );

    return () => clearTimeout(timer);
  }, [
    mismatchRevealDurationMs,
    state.feedback?.id,
    state.firstRevealedCardId,
    state.gameId,
    state.secondRevealedCardId,
    state.status,
  ]);

  const createDeck = useCallback(
    (difficulty: MemoryGameDifficulty) =>
      createMemoryGameDeck(flags, {
        difficulty,
        random,
      }),
    [flags, random],
  );

  const startGame = useCallback(() => {
    nextGameId.current += 1;
    dispatch({
      type: 'start',
      gameId: nextGameId.current,
      difficulty: state.difficulty,
      deck: createDeck(state.difficulty),
    });
  }, [createDeck, state.difficulty]);

  const restartGame = useCallback(() => {
    nextGameId.current += 1;
    dispatch({
      type: 'restart',
      gameId: nextGameId.current,
      difficulty: state.difficulty,
      deck: createDeck(state.difficulty),
    });
  }, [createDeck, state.difficulty]);

  const selectDifficulty = useCallback((difficulty: MemoryGameDifficulty) => {
    nextGameId.current += 1;
    dispatch({ type: 'reset', gameId: nextGameId.current, difficulty });
  }, []);

  const returnToSetup = useCallback(() => {
    nextGameId.current += 1;
    dispatch({ type: 'reset', gameId: nextGameId.current });
  }, []);

  const flipCard = useCallback((cardId: string) => {
    dispatch({ type: 'flip-card', cardId });
  }, []);

  return {
    state,
    startGame,
    restartGame,
    selectDifficulty,
    returnToSetup,
    flipCard,
  };
}
