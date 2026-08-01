import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { AppButton } from '@/shared/components/AppButton';
import { borderRadius, colors, fontSizes, spacing } from '@/shared/theme';
import { DIFFICULTY_CONFIG } from '@/features/guess-flag-game/constants/guessFlagGame.constants';
import type { GuessFlagDifficulty } from '@/features/guess-flag-game/types';
import { getPerformanceMessage } from '@/features/guess-flag-game/utils/guessFlagGameRules';

type GuessFlagGameResultProps = {
  readonly difficulty: GuessFlagDifficulty;
  readonly score: number;
  readonly correctAnswers: number;
  readonly incorrectAnswers: number;
  readonly bestStreak: number;
  readonly onRestart: () => void;
  readonly onChangeDifficulty: () => void;
  readonly onBack: () => void;
};

type ResultMetricProps = {
  readonly label: string;
  readonly value: string | number;
};

function ResultMetric({ label, value }: ResultMetricProps) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

export function GuessFlagGameResult({
  difficulty,
  score,
  correctAnswers,
  incorrectAnswers,
  bestStreak,
  onRestart,
  onChangeDifficulty,
  onBack,
}: GuessFlagGameResultProps) {
  const difficultyConfig = DIFFICULTY_CONFIG[difficulty];

  return (
    <Animated.View entering={FadeInUp.duration(320)} style={styles.container}>
      <Text style={styles.celebration}>★</Text>
      <Text style={styles.title}>Partida concluída!</Text>
      <Text style={styles.message}>{getPerformanceMessage(correctAnswers)}</Text>

      <View style={styles.difficultyBadge} accessible>
        <Text style={styles.difficultyLabel}>{difficultyConfig.label}</Text>
        <Text style={styles.difficultyMultiplier}>
          Multiplicador {difficultyConfig.multiplierLabel}
        </Text>
      </View>

      <View style={styles.scoreCard} accessible>
        <Text style={styles.scoreLabel}>Pontuação final</Text>
        <Text style={styles.score}>{score} pts</Text>
      </View>

      <View style={styles.metricsRow}>
        <ResultMetric label="Acertos" value={correctAnswers} />
        <ResultMetric label="Erros" value={incorrectAnswers} />
        <ResultMetric label="Melhor sequência" value={bestStreak} />
      </View>

      <View style={styles.actions}>
        <AppButton title="Jogar novamente" onPress={onRestart} />
        <AppButton title="Trocar dificuldade" variant="secondary" onPress={onChangeDifficulty} />
        <AppButton title="Voltar aos jogos" variant="secondary" onPress={onBack} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    paddingBottom: spacing.xl,
  },
  celebration: {
    color: colors.primary,
    fontSize: 64,
    marginBottom: spacing.sm,
  },
  title: {
    color: colors.textPrimary,
    fontSize: fontSizes.xl,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  message: {
    color: colors.textSecondary,
    fontSize: fontSizes.md,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  difficultyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderColor: colors.primary,
    borderWidth: 1,
    borderRadius: borderRadius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.md,
  },
  difficultyLabel: {
    color: colors.primary,
    fontSize: fontSizes.sm,
    fontWeight: '800',
  },
  difficultyMultiplier: {
    color: colors.textSecondary,
    fontSize: fontSizes.sm,
  },
  scoreCard: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.primary,
    borderWidth: 1,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  scoreLabel: {
    color: colors.textSecondary,
    fontSize: fontSizes.sm,
    marginBottom: spacing.xs,
  },
  score: {
    color: colors.primary,
    fontSize: fontSizes.xxl,
    fontWeight: '800',
  },
  metricsRow: {
    width: '100%',
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  metric: {
    flex: 1,
    minHeight: 82,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
  },
  metricValue: {
    color: colors.textPrimary,
    fontSize: fontSizes.lg,
    fontWeight: '800',
    marginBottom: spacing.xs,
  },
  metricLabel: {
    color: colors.textSecondary,
    fontSize: fontSizes.xs,
    textAlign: 'center',
  },
  actions: {
    width: '100%',
    gap: spacing.sm,
  },
});
