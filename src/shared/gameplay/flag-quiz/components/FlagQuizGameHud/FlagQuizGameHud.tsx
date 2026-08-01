import { StyleSheet, Text, View } from 'react-native';
import { borderRadius, colors, fontSizes, spacing } from '@/shared/theme';
import { DIFFICULTY_CONFIG } from '@/shared/gameplay/flag-quiz/constants/flagQuiz.constants';
import type { FlagQuizDifficulty } from '@/shared/gameplay/flag-quiz/types';

type FlagQuizGameHudProps = {
  readonly difficulty: FlagQuizDifficulty;
  readonly currentRound: number;
  readonly totalRounds: number;
  readonly score: number;
  readonly correctAnswers: number;
  readonly streak: number;
};

export function FlagQuizGameHud({
  difficulty,
  currentRound,
  totalRounds,
  score,
  correctAnswers,
  streak,
}: FlagQuizGameHudProps) {
  const difficultyConfig = DIFFICULTY_CONFIG[difficulty];

  return (
    <View
      style={styles.container}
      accessible
      accessibilityLabel={`${difficultyConfig.label}, multiplicador ${difficultyConfig.multiplierLabel}. Rodada ${currentRound} de ${totalRounds}. ${score} pontos. ${correctAnswers} acertos. Sequência de ${streak}.`}
    >
      <View style={styles.difficultyRow}>
        <Text style={styles.difficulty}>{difficultyConfig.label}</Text>
        <Text style={styles.multiplier}>{difficultyConfig.multiplierLabel} pontos</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.primaryMetric}>
          Rodada {currentRound}/{totalRounds}
        </Text>
        <Text style={styles.score}>{score} pts</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.secondaryMetric}>Acertos: {correctAnswers}</Text>
        <Text style={styles.secondaryMetric}>Sequência: {streak}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    gap: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
  },
  difficultyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: spacing.sm,
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
  },
  difficulty: {
    color: colors.primary,
    fontSize: fontSizes.sm,
    fontWeight: '800',
  },
  multiplier: {
    color: colors.textSecondary,
    fontSize: fontSizes.sm,
    fontWeight: '700',
  },
  primaryMetric: {
    color: colors.textPrimary,
    fontSize: fontSizes.md,
    fontWeight: '700',
  },
  score: {
    color: colors.primary,
    fontSize: fontSizes.md,
    fontWeight: '800',
  },
  secondaryMetric: {
    color: colors.textSecondary,
    fontSize: fontSizes.sm,
  },
});
