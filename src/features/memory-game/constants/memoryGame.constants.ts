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
    pairCount: 10,
  },
  medium: {
    label: 'Médio',
    pairCount: 12,
  },
  hard: {
    label: 'Difícil',
    pairCount: 14,
  },
};

export function isMemoryGameDifficulty(value: unknown): value is MemoryGameDifficulty {
  return MEMORY_GAME_DIFFICULTIES.some((difficulty) => difficulty === value);
}

export function getMemoryGameCardCount(difficulty: MemoryGameDifficulty): number {
  return getMemoryGamePairCount(difficulty) * 2;
}

export function getMemoryGamePairCount(difficulty: MemoryGameDifficulty): number {
  return MEMORY_GAME_DIFFICULTY_CONFIG[difficulty].pairCount;
}
