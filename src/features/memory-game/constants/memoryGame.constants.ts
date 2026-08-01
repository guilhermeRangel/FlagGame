import type {
  MemoryGameDifficulty,
  MemoryGameDifficultyConfig,
} from '@/features/memory-game/types';

export const MEMORY_GAME_DIFFICULTIES: readonly MemoryGameDifficulty[] = ['easy', 'medium', 'hard'];

export const MEMORY_CARD_FLIP_DURATION_MS = 220;
export const MEMORY_MISMATCH_REVEAL_DURATION_MS = 900;

export const MEMORY_GAME_DIFFICULTY_CONFIG: Readonly<
  Record<MemoryGameDifficulty, MemoryGameDifficultyConfig>
> = {
  easy: {
    label: 'Fácil',
    cardCount: 20,
    pairCount: 10,
  },
  medium: {
    label: 'Médio',
    cardCount: 24,
    pairCount: 12,
  },
  hard: {
    label: 'Difícil',
    cardCount: 28,
    pairCount: 14,
  },
};

export function isMemoryGameDifficulty(value: unknown): value is MemoryGameDifficulty {
  return MEMORY_GAME_DIFFICULTIES.some((difficulty) => difficulty === value);
}

export function getMemoryGameCardCount(difficulty: MemoryGameDifficulty): number {
  return MEMORY_GAME_DIFFICULTY_CONFIG[difficulty].cardCount;
}

export function getMemoryGamePairCount(difficulty: MemoryGameDifficulty): number {
  return MEMORY_GAME_DIFFICULTY_CONFIG[difficulty].pairCount;
}
