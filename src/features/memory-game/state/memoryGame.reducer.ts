import {
  getMemoryGameCardCount,
  getMemoryGamePairCount,
  isMemoryGameDifficulty,
} from '@/features/memory-game/constants/memoryGame.constants';
import type {
  MemoryGameAction,
  MemoryGameCard,
  MemoryGameDifficulty,
  MemoryGameFeedbackResult,
  MemoryGameState,
} from '@/features/memory-game/types';
import { getFlagVisualIdentity } from '@/shared/domain/flags/flagVisualIdentity';

function createScoreState() {
  return {
    moves: 0,
    matches: 0,
    streak: 0,
    bestStreak: 0,
  } as const;
}

function createReadyState(gameId: number, difficulty: MemoryGameDifficulty): MemoryGameState {
  return {
    gameId,
    difficulty,
    status: 'ready',
    cards: [],
    ...createScoreState(),
  };
}

function resetDeckCards(cards: readonly MemoryGameCard[]): MemoryGameCard[] {
  return cards.map((card) => ({ ...card, status: 'hidden' }));
}

export function isCompleteMemoryGameDeck(
  cards: readonly MemoryGameCard[],
  difficulty: MemoryGameDifficulty,
): boolean {
  if (!isMemoryGameDifficulty(difficulty) || cards.length !== getMemoryGameCardCount(difficulty)) {
    return false;
  }

  const cardIds = new Set<string>();
  const cardsByPairId = new Map<string, MemoryGameCard[]>();

  for (const card of cards) {
    if (!card.id || !card.pairId || !card.flag.id || cardIds.has(card.id)) {
      return false;
    }

    cardIds.add(card.id);
    const pairCards = cardsByPairId.get(card.pairId) ?? [];
    pairCards.push(card);
    cardsByPairId.set(card.pairId, pairCards);
  }

  if (cardsByPairId.size !== getMemoryGamePairCount(difficulty)) {
    return false;
  }

  const pairVisualIdentities = new Set<string>();

  for (const pairCards of cardsByPairId.values()) {
    if (pairCards.length !== 2) {
      return false;
    }

    const [firstCard, secondCard] = pairCards;
    const firstVisualIdentity = getFlagVisualIdentity(firstCard.flag);
    const secondVisualIdentity = getFlagVisualIdentity(secondCard.flag);

    if (
      firstCard.flag.id !== secondCard.flag.id ||
      firstVisualIdentity !== secondVisualIdentity ||
      pairVisualIdentities.has(firstVisualIdentity)
    ) {
      return false;
    }

    pairVisualIdentities.add(firstVisualIdentity);
  }

  return true;
}

function createStartedState(
  gameId: number,
  difficulty: MemoryGameDifficulty,
  deck: readonly MemoryGameCard[],
): MemoryGameState {
  if (!isCompleteMemoryGameDeck(deck, difficulty)) {
    return {
      gameId,
      difficulty,
      status: 'unavailable',
      cards: [],
      ...createScoreState(),
    };
  }

  return {
    gameId,
    difficulty,
    status: 'playing',
    cards: resetDeckCards(deck),
    ...createScoreState(),
  };
}

export function createMemoryGameInitialState(
  gameId: number = 0,
  difficulty: MemoryGameDifficulty = 'easy',
): MemoryGameState {
  return createReadyState(gameId, difficulty);
}

function createFeedbackEvent(
  gameId: number,
  move: number,
  result: MemoryGameFeedbackResult,
  cardIds: readonly [string, string],
  isGameFinished: boolean,
  pairId?: string,
) {
  return {
    id: `${gameId}:${move}:${result}`,
    result,
    move,
    cardIds,
    pairId,
    isGameFinished,
  } as const;
}

function updateCardsStatus(
  cards: readonly MemoryGameCard[],
  cardIds: ReadonlySet<string>,
  status: MemoryGameCard['status'],
): MemoryGameCard[] {
  return cards.map((card) => (cardIds.has(card.id) ? { ...card, status } : card));
}

export function memoryGameReducer(
  state: MemoryGameState,
  action: MemoryGameAction,
): MemoryGameState {
  switch (action.type) {
    case 'start':
      return createStartedState(action.gameId, action.difficulty, action.deck);

    case 'flip-card': {
      if (state.status !== 'playing') {
        return state;
      }

      const selectedCard = state.cards.find((card) => card.id === action.cardId);

      if (!selectedCard || selectedCard.status !== 'hidden') {
        return state;
      }

      if (!state.firstRevealedCardId) {
        return {
          ...state,
          cards: updateCardsStatus(state.cards, new Set([selectedCard.id]), 'revealed'),
          firstRevealedCardId: selectedCard.id,
          secondRevealedCardId: undefined,
          feedback: undefined,
        };
      }

      const firstCard = state.cards.find((card) => card.id === state.firstRevealedCardId);

      if (!firstCard || firstCard.status !== 'revealed') {
        return state;
      }

      const nextMove = state.moves + 1;
      const selectedCardIds = new Set([firstCard.id, selectedCard.id]);
      const isMatch = firstCard.pairId === selectedCard.pairId;

      if (isMatch) {
        const nextMatches = state.matches + 1;
        const nextStreak = state.streak + 1;
        const isGameFinished = nextMatches === getMemoryGamePairCount(state.difficulty);

        return {
          ...state,
          status: isGameFinished ? 'finished' : 'playing',
          cards: updateCardsStatus(state.cards, selectedCardIds, 'matched'),
          firstRevealedCardId: undefined,
          secondRevealedCardId: undefined,
          moves: nextMove,
          matches: nextMatches,
          streak: nextStreak,
          bestStreak: Math.max(state.bestStreak, nextStreak),
          lastMatchedCountryName: firstCard.flag.countryName,
          feedback: createFeedbackEvent(
            state.gameId,
            nextMove,
            'match',
            [firstCard.id, selectedCard.id],
            isGameFinished,
            firstCard.pairId,
          ),
        };
      }

      return {
        ...state,
        status: 'resolving-mismatch',
        cards: updateCardsStatus(state.cards, selectedCardIds, 'revealed'),
        secondRevealedCardId: selectedCard.id,
        moves: nextMove,
        streak: 0,
        feedback: createFeedbackEvent(
          state.gameId,
          nextMove,
          'mismatch',
          [firstCard.id, selectedCard.id],
          false,
        ),
      };
    }

    case 'resolve-mismatch': {
      if (
        state.status !== 'resolving-mismatch' ||
        action.gameId !== state.gameId ||
        !state.firstRevealedCardId ||
        !state.secondRevealedCardId
      ) {
        return state;
      }

      const mismatchedCardIds = new Set(
        [state.firstRevealedCardId, state.secondRevealedCardId].filter((cardId): cardId is string =>
          Boolean(cardId),
        ),
      );

      return {
        ...state,
        cards: updateCardsStatus(state.cards, mismatchedCardIds, 'hidden'),
        firstRevealedCardId: undefined,
        secondRevealedCardId: undefined,
        feedback: undefined,
      };
    }

    case 'complete-mismatch':
      if (
        state.status !== 'resolving-mismatch' ||
        action.gameId !== state.gameId ||
        state.firstRevealedCardId ||
        state.secondRevealedCardId
      ) {
        return state;
      }

      return {
        ...state,
        status: 'playing',
      };

    case 'restart':
      return createStartedState(action.gameId, action.difficulty ?? state.difficulty, action.deck);

    case 'reset':
      return createReadyState(action.gameId, action.difficulty ?? state.difficulty);
  }
}
