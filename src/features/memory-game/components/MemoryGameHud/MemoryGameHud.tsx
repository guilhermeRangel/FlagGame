import { StyleSheet, Text, View } from 'react-native';
import { borderRadius, colors, fontSizes, spacing } from '@/shared/theme';

type MemoryGameHudProps = {
  readonly matches: number;
  readonly totalPairs: number;
  readonly moves: number;
  readonly streak: number;
  readonly bestStreak: number;
  readonly lastMatchedCountryName?: string;
};

type MetricProps = {
  readonly label: string;
  readonly value: string | number;
  readonly highlighted?: boolean;
};

function Metric({ label, value, highlighted = false }: MetricProps) {
  return (
    <View style={styles.metric}>
      <Text style={[styles.metricValue, highlighted && styles.highlighted]}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

export function MemoryGameHud({
  matches,
  totalPairs,
  moves,
  streak,
  bestStreak,
  lastMatchedCountryName,
}: MemoryGameHudProps) {
  const lastMatchAccessibility = lastMatchedCountryName
    ? `Última bandeira encontrada: ${lastMatchedCountryName}.`
    : 'Nenhuma bandeira encontrada ainda.';
  const accessibilityLabel = `${matches} de ${totalPairs} pares encontrados. ${moves} jogadas. Sequência atual ${streak}. Melhor sequência ${bestStreak}. ${lastMatchAccessibility}`;

  return (
    <View accessible accessibilityLabel={accessibilityLabel} style={styles.container}>
      <View style={styles.metricsRow}>
        <Metric highlighted label="Pares" value={`${matches}/${totalPairs}`} />
        <View style={styles.divider} />
        <Metric label="Jogadas" value={moves} />
        <View style={styles.divider} />
        <Metric label="Sequência" value={streak} />
        <View style={styles.divider} />
        <Metric label="Melhor" value={bestStreak} />
      </View>
      <View style={styles.lastMatchDivider} />
      <View style={styles.lastMatchRow}>
        <Text numberOfLines={2} style={styles.lastMatchText}>
          Última encontrada:{' '}
          <Text style={styles.lastMatchValue}>{lastMatchedCountryName ?? 'nenhuma ainda'}</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },
  metricsRow: {
    width: '100%',
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
  },
  metric: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricValue: {
    color: colors.textPrimary,
    fontSize: fontSizes.md,
    fontWeight: '800',
  },
  highlighted: {
    color: colors.primary,
  },
  metricLabel: {
    color: colors.textSecondary,
    fontSize: fontSizes.xs,
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 32,
    backgroundColor: colors.border,
  },
  lastMatchDivider: {
    width: '100%',
    height: 1,
    backgroundColor: colors.border,
    marginTop: spacing.xs,
  },
  lastMatchRow: {
    width: '100%',
    minHeight: 32,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.sm,
  },
  lastMatchText: {
    color: colors.textSecondary,
    fontSize: fontSizes.sm,
    textAlign: 'center',
  },
  lastMatchValue: {
    color: colors.primary,
    fontWeight: '800',
  },
});
