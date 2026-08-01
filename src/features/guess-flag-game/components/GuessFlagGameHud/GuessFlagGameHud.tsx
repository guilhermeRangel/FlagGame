import { StyleSheet, Text, View } from 'react-native';
import { borderRadius, colors, fontSizes, spacing } from '@/shared/theme';

type GuessFlagGameHudProps = {
  readonly currentRound: number;
  readonly totalRounds: number;
  readonly score: number;
  readonly correctAnswers: number;
  readonly streak: number;
};

export function GuessFlagGameHud({
  currentRound,
  totalRounds,
  score,
  correctAnswers,
  streak,
}: GuessFlagGameHudProps) {
  return (
    <View
      style={styles.container}
      accessible
      accessibilityLabel={`Rodada ${currentRound} de ${totalRounds}. ${score} pontos. ${correctAnswers} acertos. Sequência de ${streak}.`}
    >
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
