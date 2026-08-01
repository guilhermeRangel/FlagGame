import {
  BASE_CORRECT_ANSWER_POINTS,
  STREAK_BONUS_POINTS,
  STREAK_BONUS_THRESHOLD,
} from '@/features/guess-flag-game/constants/guessFlagGame.constants';
import type { GuessFlagGameStatus, GuessFlagOptionState } from '@/features/guess-flag-game/types';

export function calculateAnswerPoints(streakIncludingCurrentAnswer: number): number {
  const hasStreakBonus = streakIncludingCurrentAnswer >= STREAK_BONUS_THRESHOLD;
  return BASE_CORRECT_ANSWER_POINTS + (hasStreakBonus ? STREAK_BONUS_POINTS : 0);
}

export function getGuessFlagOptionState(
  optionId: string,
  selectedOptionId: string | undefined,
  correctOptionId: string,
  status: GuessFlagGameStatus,
): GuessFlagOptionState {
  if (status === 'playing') {
    return 'idle';
  }

  if (status !== 'showing-feedback') {
    return 'disabled';
  }

  if (optionId === correctOptionId) {
    return 'correct';
  }

  if (optionId === selectedOptionId) {
    return 'incorrect';
  }

  return 'disabled';
}

export function getPerformanceMessage(correctAnswers: number): string {
  if (correctAnswers <= 3) {
    return 'Continue tentando! Cada rodada é uma nova descoberta.';
  }

  if (correctAnswers <= 6) {
    return 'Muito bem! Você já conhece várias bandeiras.';
  }

  if (correctAnswers <= 9) {
    return 'Excelente! Seu conhecimento está muito forte.';
  }

  return 'Perfeito! Você é um mestre das bandeiras.';
}
