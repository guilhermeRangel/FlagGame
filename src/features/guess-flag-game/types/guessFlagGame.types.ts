import type { FlagVisual } from '@/shared/domain/flags';

export type GuessFlagGameStatus = 'playing' | 'showing-feedback' | 'finished' | 'unavailable';

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
  readonly options: readonly GuessFlagOption[];
};

export type GuessFlagAnswerFeedback = {
  readonly id: string;
  readonly isCorrect: boolean;
  readonly pointsAwarded: number;
  readonly correctCountryName: string;
};

export type GuessFlagGameState = {
  readonly gameId: number;
  readonly status: GuessFlagGameStatus;
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
