import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInLeft, ZoomIn } from 'react-native-reanimated';
import { borderRadius, colors, fontSizes, spacing } from '@/shared/theme';
import type { GuessFlagAnswerFeedback } from '@/features/guess-flag-game/types';

type GuessFlagFeedbackProps = {
  readonly feedback: GuessFlagAnswerFeedback;
};

export function GuessFlagFeedback({ feedback }: GuessFlagFeedbackProps) {
  const backgroundColor = feedback.isCorrect ? colors.successSurface : colors.dangerSurface;
  const borderColor = feedback.isCorrect ? colors.success : colors.danger;
  const title = feedback.isCorrect ? 'Parabéns! Resposta correta.' : 'Resposta incorreta.';
  const detail = feedback.isCorrect
    ? `+${feedback.pointsAwarded} pontos`
    : `A resposta correta era ${feedback.correctCountryName}.`;

  return (
    <Animated.View
      entering={feedback.isCorrect ? ZoomIn.duration(220) : FadeInLeft.duration(220)}
      style={[styles.container, { backgroundColor, borderColor }]}
      accessible
      accessibilityLiveRegion="polite"
      accessibilityLabel={`${title} ${detail}`}
    >
      <View style={[styles.icon, { borderColor }]}>
        <Text style={[styles.iconText, { color: borderColor }]}>
          {feedback.isCorrect ? '✓' : '✕'}
        </Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.detail}>{detail}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 74,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    gap: spacing.md,
  },
  icon: {
    width: 34,
    height: 34,
    borderWidth: 2,
    borderRadius: borderRadius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: fontSizes.md,
    fontWeight: '800',
  },
  content: {
    flex: 1,
    gap: spacing.xs,
  },
  title: {
    color: colors.textPrimary,
    fontSize: fontSizes.md,
    fontWeight: '800',
  },
  detail: {
    color: colors.textSecondary,
    fontSize: fontSizes.sm,
  },
});
