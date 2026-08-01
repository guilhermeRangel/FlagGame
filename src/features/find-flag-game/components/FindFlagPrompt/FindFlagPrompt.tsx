import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { borderRadius, colors, fontSizes, spacing } from '@/shared/theme';

export type FindFlagPromptTone = 'neutral' | 'correct' | 'incorrect';

type FindFlagPromptProps = {
  readonly countryName: string;
  readonly tone: FindFlagPromptTone;
};

export function FindFlagPrompt({ countryName, tone }: FindFlagPromptProps) {
  const borderColor =
    tone === 'correct' ? colors.success : tone === 'incorrect' ? colors.danger : colors.border;
  const backgroundColor =
    tone === 'correct'
      ? colors.successSurface
      : tone === 'incorrect'
        ? colors.dangerSurface
        : colors.surface;

  return (
    <Animated.View
      entering={FadeIn.duration(260)}
      style={[styles.container, { borderColor, backgroundColor }]}
      accessible
      accessibilityLabel={`Escolha a bandeira correta para ${countryName}.`}
    >
      <Text
        style={styles.question}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        Escolha a bandeira correta
      </Text>
      <View style={styles.divider} />
      <Text
        style={styles.countryName}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        {countryName}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 126,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderWidth: 2,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  question: {
    color: colors.textSecondary,
    fontSize: fontSizes.md,
    fontWeight: '700',
    textAlign: 'center',
  },
  divider: {
    width: 44,
    height: 3,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.primary,
  },
  countryName: {
    color: colors.textPrimary,
    fontSize: fontSizes.xxl,
    fontWeight: '800',
    lineHeight: 38,
    textAlign: 'center',
  },
});
