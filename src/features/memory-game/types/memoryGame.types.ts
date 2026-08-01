import type { Flag } from '@/shared/domain/flags';

export type MemoryGameDifficulty = 'easy' | 'medium' | 'hard';

export type MemoryGameStatus =
  'ready' | 'playing' | 'resolving-mismatch' | 'finished' | 'unavailable';

export type MemoryGameCardStatus = 'hidden' | 'revealed' | 'matched';

export type MemoryGameCard = {
  readonly id: string;
  readonly pairId: string;
  readonly flag: Flag;
  readonly status: MemoryGameCardStatus;
};

export type MemoryGameFeedbackResult = 'match' | 'mismatch';

export type MemoryGameFeedbackEvent = {
  readonly id: string;
  readonly result: MemoryGameFeedbackResult;
  readonly move: number;
  readonly cardIds: readonly [string, string];
  readonly pairId?: string;
  readonly isGameFinished: boolean;
};

export type MemoryGameState = {
  readonly gameId: number;
  readonly difficulty: MemoryGameDifficulty;
  readonly status: MemoryGameStatus;
  readonly cards: readonly MemoryGameCard[];
  readonly firstRevealedCardId?: string;
  readonly secondRevealedCardId?: string;
  readonly moves: number;
  readonly matches: number;
  readonly streak: number;
  readonly bestStreak: number;
  readonly lastMatchedCountryName?: string;
  readonly feedback?: MemoryGameFeedbackEvent;
};

export type MemoryGameAction =
  | {
      readonly type: 'start';
      readonly gameId: number;
      readonly difficulty: MemoryGameDifficulty;
      readonly deck: readonly MemoryGameCard[];
    }
  | { readonly type: 'flip-card'; readonly cardId: string }
  | { readonly type: 'resolve-mismatch'; readonly gameId: number }
  | { readonly type: 'complete-mismatch'; readonly gameId: number }
  | {
      readonly type: 'restart';
      readonly gameId: number;
      readonly deck: readonly MemoryGameCard[];
      readonly difficulty?: MemoryGameDifficulty;
    }
  | {
      readonly type: 'reset';
      readonly gameId: number;
      readonly difficulty?: MemoryGameDifficulty;
    };

export type MemoryGameDifficultyConfig = {
  readonly label: string;
  readonly cardCount: number;
  readonly pairCount: number;
};
