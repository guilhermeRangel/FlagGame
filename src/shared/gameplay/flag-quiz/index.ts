export { FlagQuizDifficultySelector } from './components/FlagQuizDifficultySelector';
export { FlagQuizFeedback } from './components/FlagQuizFeedback';
export { FlagQuizGameHud } from './components/FlagQuizGameHud';
export { FlagQuizGameResult } from './components/FlagQuizGameResult';
export { FlagVisual } from './components/FlagVisual';
export {
  BASE_CORRECT_ANSWER_POINTS,
  DEFAULT_ANSWER_FEEDBACK_DURATION_MS,
  DIFFICULTY_CONFIG,
  FLAG_QUIZ_DIFFICULTIES,
  FLAG_QUIZ_OPTION_COUNT,
  FLAG_QUIZ_TOTAL_ROUNDS,
  STREAK_BONUS_POINTS,
  STREAK_BONUS_THRESHOLD,
  getDifficultyMultiplier,
  getDifficultyRoundDistribution,
} from './constants/flagQuiz.constants';
export type {
  DifficultyRoundDistribution,
  FlagQuizDifficultyConfig,
} from './constants/flagQuiz.constants';
export {
  EXPECTED_FLAG_QUIZ_CLASSIFICATION_COUNT,
  FLAG_IDS_BY_DIFFICULTY,
} from './data/flag-difficulty.data';
export { flagQuizGameReducer, useFlagQuizGame } from './hooks/useFlagQuizGame';
export type { FlagQuizGameAction, UseFlagQuizGameOptions } from './hooks/useFlagQuizGame';
export { useFlagQuizGameSounds } from './hooks/useFlagQuizGameSounds';
export type {
  FlagQuizAnswerFeedback,
  FlagQuizChoice,
  FlagQuizDifficulty,
  FlagQuizGameState,
  FlagQuizGameStatus,
  FlagQuizOptionState,
  FlagQuizRound,
} from './types';
export { createFlagQuizQuestions, createFlagQuizRound } from './utils/createFlagQuizQuestions';
export type { CreateFlagQuizQuestionsOptions, RandomSource } from './utils/createFlagQuizQuestions';
export {
  calculateAnswerPoints,
  getFlagQuizOptionState,
  getPerformanceMessage,
} from './utils/flagQuizRules';
export {
  FLAG_VISUAL_EQUIVALENCE_GROUPS,
  getFlagVisualIdentity,
  haveEquivalentFlagVisuals,
} from './utils/flagVisualIdentity';
export {
  assertFlagDifficultyClassification,
  validateFlagDifficultyClassification,
} from './utils/validateFlagDifficultyClassification';
export type { FlagDifficultyClassificationValidation } from './utils/validateFlagDifficultyClassification';
