export {
  MEMORY_CARD_FLIP_DURATION_MS,
  MEMORY_GAME_DIFFICULTIES,
  MEMORY_GAME_DIFFICULTY_CONFIG,
  MEMORY_MISMATCH_REVEAL_DURATION_MS,
  getMemoryGameCardCount,
  getMemoryGamePairCount,
  isMemoryGameDifficulty,
} from './constants';
export { createMemoryGameInitialState, isCompleteMemoryGameDeck, memoryGameReducer } from './state';
export type {
  MemoryGameAction,
  MemoryGameCard,
  MemoryGameCardStatus,
  MemoryGameDifficulty,
  MemoryGameDifficultyConfig,
  MemoryGameFeedbackEvent,
  MemoryGameFeedbackResult,
  MemoryGameState,
  MemoryGameStatus,
} from './types';
export { createMemoryGameDeck } from './utils';
export type { CreateMemoryGameDeckOptions, RandomSource } from './utils';
