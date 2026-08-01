import { Pressable, StyleSheet, Text } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { colors, borderRadius, fontSizes, spacing } from '@/shared/theme';
import type { Flag, RotationSpeed } from '@/features/flag-game/types';

type InteractiveFlagCardProps = {
  readonly flag: Flag;
  readonly speed: RotationSpeed;
  readonly onPress: (flagId: string) => void;
};

export function InteractiveFlagCard({ flag, speed, onPress }: InteractiveFlagCardProps) {
  const rotation = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  rotation.value = withTiming(speed * 90, { duration: 220, easing: Easing.linear });

  let label = 'Parado';
  if (speed > 0 && speed < 4) {
    label = `Velocidade ${speed}x`;
  } else if (speed === 4) {
    label = 'Velocidade máxima';
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Bandeira ${flag.countryName}`}
      onPress={() => onPress(flag.id)}
      style={styles.card}
    >
      <Animated.View style={[styles.flagDisplay, animatedStyle]}>
        <Text style={styles.emoji}>{flag.visual.type === 'emoji' ? flag.visual.value : '🏁'}</Text>
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
  flagDisplay: {
    width: '100%',
    aspectRatio: 3 / 2,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  emoji: {
    fontSize: 22,
  },
  countryName: {
    color: colors.textPrimary,
    fontSize: fontSizes.xs,
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
