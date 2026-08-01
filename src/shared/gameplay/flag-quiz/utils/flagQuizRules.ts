import {
  BASE_CORRECT_ANSWER_POINTS,
  STREAK_BONUS_POINTS,
  STREAK_BONUS_THRESHOLD,
} from '@/shared/gameplay/flag-quiz/constants/flagQuiz.constants';
import type { FlagQuizGameStatus, FlagQuizOptionState } from '@/shared/gameplay/flag-quiz/types';

export function calculateAnswerPoints(
  streakIncludingCurrentAnswer: number,
  multiplier: number = 1,
): number {
  const hasStreakBonus = streakIncludingCurrentAnswer >= STREAK_BONUS_THRESHOLD;
  const pointsBeforeMultiplier =
    BASE_CORRECT_ANSWER_POINTS + (hasStreakBonus ? STREAK_BONUS_POINTS : 0);
  const safeMultiplier = Number.isFinite(multiplier) && multiplier > 0 ? multiplier : 1;

  return Math.round(pointsBeforeMultiplier * safeMultiplier);
}

export function getFlagQuizOptionState(
  optionId: string,
  selectedOptionId: string | undefined,
  correctOptionId: string,
  status: FlagQuizGameStatus,
): FlagQuizOptionState {
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

export function getPerformanceMessage(correctAnswers: number, totalRounds: number = 10): string {
  const safeTotalRounds = Number.isFinite(totalRounds) && totalRounds > 0 ? totalRounds : 10;
  const performance = Math.max(0, correctAnswers) / safeTotalRounds;

  if (performance <= 0.3) {
    return 'Continue tentando! Cada rodada é uma nova descoberta.';
  }

  if (performance <= 0.6) {
    return 'Muito bem! Você já conhece várias bandeiras.';
  }

  if (performance < 1) {
    return 'Excelente! Seu conhecimento está muito forte.';
  }

  return 'Perfeito! Você é um mestre das bandeiras.';
}
