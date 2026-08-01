import { StyleSheet, Text } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { FlagVisual } from '@/shared/gameplay/flag-quiz';
import { borderRadius, colors, fontSizes, spacing } from '@/shared/theme';
import type { FlagVisual as FlagVisualValue } from '@/shared/domain/flags';

type GuessFlagPromptTone = 'neutral' | 'correct' | 'incorrect';

type GuessFlagPromptProps = {
  readonly visual: FlagVisualValue;
  readonly tone: GuessFlagPromptTone;
};

export function GuessFlagPrompt({ visual, tone }: GuessFlagPromptProps) {
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
      accessibilityRole="image"
      accessibilityLabel="Nova bandeira. Escolha o país correto entre as opções."
    >
      <Text
        style={styles.question}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        Qual é esta bandeira?
      </Text>
      <FlagVisual
        visual={visual}
        style={visual.type === 'emoji' ? styles.emojiContainer : styles.asset}
        emojiStyle={styles.emoji}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 190,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    padding: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  question: {
    color: colors.textPrimary,
    fontSize: fontSizes.lg,
    fontWeight: '700',
  },
  emoji: {
    fontSize: 88,
    lineHeight: 104,
  },
  emojiContainer: {
    width: 150,
    height: 104,
  },
  asset: {
    width: 150,
    height: 96,
  },
});
