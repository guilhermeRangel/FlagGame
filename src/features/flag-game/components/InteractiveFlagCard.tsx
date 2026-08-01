import { useEffect } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { colors, borderRadius, fontSizes, spacing } from '@/shared/theme';
import type { Flag, RotationSpeed } from '@/features/flag-game/types';

type InteractiveFlagCardProps = {
  readonly flag: Flag;
  readonly speed: RotationSpeed;
  readonly onPress: (flagId: string) => void;
};

export function InteractiveFlagCard({ flag, speed, onPress }: InteractiveFlagCardProps) {
  const rotation = useSharedValue(0);
  const isUnavailable = speed === 4;

  useEffect(() => {
    rotation.value = withTiming(speed * 90, { duration: 220, easing: Easing.linear });
  }, [rotation, speed]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  let label = '4 giros restantes';
  if (speed > 0 && speed < 4) {
    const remainingSpins = 4 - speed;
    label = `${remainingSpins} giro${remainingSpins === 1 ? '' : 's'} restante${remainingSpins === 1 ? '' : 's'}`;
  } else if (isUnavailable) {
    label = 'Indisponível';
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Bandeira ${flag.countryName}`}
      accessibilityHint={
        isUnavailable ? 'Os quatro giros já foram usados' : 'Gira a bandeira uma vez'
      }
      accessibilityState={{ disabled: isUnavailable }}
      disabled={isUnavailable}
      onPress={() => onPress(flag.id)}
      style={[styles.card, isUnavailable && styles.cardUnavailable]}
    >
      <Animated.View
        style={[styles.flagDisplay, isUnavailable && styles.flagDisplayUnavailable, animatedStyle]}
      >
        <Text style={[styles.emoji, isUnavailable && styles.emojiUnavailable]}>
          {flag.visual.type === 'emoji' ? flag.visual.value : '🏁'}
        </Text>
      </Animated.View>
      <Text style={styles.countryName} numberOfLines={2} ellipsizeMode="tail">
        {flag.countryName}
      </Text>
      <Text style={styles.speedLabel} numberOfLines={1} ellipsizeMode="tail">
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    padding: spacing.xs,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardUnavailable: {
    backgroundColor: colors.surfacePressed,
    borderColor: colors.disabled,
  },
  flagDisplay: {
    width: '100%',
    aspectRatio: 3 / 2,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  flagDisplayUnavailable: {
    backgroundColor: colors.disabled,
  },
  emoji: {
    fontSize: 26,
  },
  emojiUnavailable: {
    opacity: 0.55,
  },
  countryName: {
    color: colors.textPrimary,
    fontSize: fontSizes.sm,
    lineHeight: 18,
    fontWeight: '700',
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  speedLabel: {
    color: colors.textSecondary,
    fontSize: fontSizes.xs,
    textAlign: 'center',
  },
});
