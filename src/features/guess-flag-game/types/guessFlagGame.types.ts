import type { FlagVisual } from '@/shared/domain/flags';

export type GuessFlagDifficulty = 'easy' | 'medium' | 'hard' | 'expert';

export type GuessFlagGameStatus =
  'selecting-difficulty' | 'playing' | 'showing-feedback' | 'finished' | 'unavailable';

export type GuessFlagOptionState = 'idle' | 'correct' | 'incorrect' | 'disabled';

export type GuessFlagOption = {
  readonly id: string;
  readonly countryName: string;
};

export type GuessFlagRound = {
  readonly id: string;
  readonly flagId: string;
  readonly flagVisual: FlagVisual;
  readonly correctOptionId: string;
  readonly correctCountryName: string;
  readonly intrinsicDifficulty: GuessFlagDifficulty;
  readonly options: readonly GuessFlagOption[];
};

export type GuessFlagAnswerFeedback = {
  readonly id: string;
  readonly isCorrect: boolean;
  readonly pointsAwarded: number;
  readonly correctCountryName: string;
  readonly difficulty: GuessFlagDifficulty;
  readonly multiplier: number;
};

export type GuessFlagGameState = {
  readonly gameId: number;
  readonly status: GuessFlagGameStatus;
  readonly difficulty?: GuessFlagDifficulty;
  readonly rounds: readonly GuessFlagRound[];
  readonly currentRoundIndex: number;
  readonly score: number;
  readonly correctAnswers: number;
  readonly incorrectAnswers: number;
  readonly streak: number;
  readonly bestStreak: number;
  readonly selectedOptionId?: string;
  readonly feedback?: GuessFlagAnswerFeedback;
};
