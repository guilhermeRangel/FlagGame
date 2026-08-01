import type { Flag } from '@/shared/domain/flags';

export type FlagQuizDifficulty = 'easy' | 'medium' | 'hard' | 'expert';

export type FlagQuizGameStatus =
  'selecting-difficulty' | 'playing' | 'showing-feedback' | 'finished' | 'unavailable';

export type FlagQuizOptionState = 'idle' | 'correct' | 'incorrect' | 'disabled';

export type FlagQuizChoice = Pick<Flag, 'id' | 'countryName' | 'visual'>;

export type FlagQuizRound = {
  readonly id: string;
  readonly correctFlag: FlagQuizChoice;
  readonly intrinsicDifficulty: FlagQuizDifficulty;
  readonly options: readonly FlagQuizChoice[];
};

export type FlagQuizAnswerFeedback = {
  readonly id: string;
  readonly isCorrect: boolean;
  readonly pointsAwarded: number;
  readonly correctFlag: FlagQuizChoice;
  readonly difficulty: FlagQuizDifficulty;
  readonly multiplier: number;
};

export type FlagQuizGameState = {
  readonly gameId: number;
  readonly status: FlagQuizGameStatus;
  readonly difficulty?: FlagQuizDifficulty;
  readonly rounds: readonly FlagQuizRound[];
  readonly currentRoundIndex: number;
  readonly score: number;
  readonly correctAnswers: number;
  readonly incorrectAnswers: number;
  readonly streak: number;
  readonly bestStreak: number;
  readonly selectedOptionId?: string;
  readonly feedback?: FlagQuizAnswerFeedback;
};
