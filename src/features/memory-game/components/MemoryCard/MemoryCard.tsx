import { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { MEMORY_CARD_FLIP_DURATION_MS } from '@/features/memory-game/constants/memoryGame.constants';
import type { MemoryGameCard as MemoryGameCardValue } from '@/features/memory-game/types';
import { FlagVisual } from '@/shared/components/FlagVisual';
import { borderRadius, colors, spacing } from '@/shared/theme';

type MemoryCardProps = {
  readonly card: MemoryGameCardValue;
  readonly position: number;
  readonly totalCards: number;
  readonly size: number;
  readonly boardLocked: boolean;
  readonly onPress: (cardId: string) => void;
};

export function MemoryCard({
  card,
  position,
  totalCards,
  size,
  boardLocked,
  onPress,
}: MemoryCardProps) {
  const isOpen = card.status !== 'hidden';
  const isMatched = card.status === 'matched';
  const reduceMotion = useReducedMotion();
  const progress = useSharedValue(isOpen ? 1 : 0);
  const isDisabled = boardLocked || isOpen;
  const accessibilityLabel = isMatched
    ? `${card.flag.countryName}. Par encontrado. Posição ${position} de ${totalCards}.`
    : isOpen
      ? `${card.flag.countryName}. Carta revelada. Posição ${position} de ${totalCards}.`
      : `Carta fechada, posição ${position} de ${totalCards}.`;

  useEffect(() => {
    progress.value = withTiming(isOpen ? 1 : 0, {
      duration: reduceMotion ? 0 : MEMORY_CARD_FLIP_DURATION_MS,
    });
  }, [isOpen, progress, reduceMotion]);

  const coverAnimatedStyle = useAnimatedStyle(() => ({
    opacity: progress.value < 0.5 ? 1 : 0,
    transform: [{ perspective: 600 }, { rotateY: `${progress.value * 180}deg` }],
  }));
  const flagAnimatedStyle = useAnimatedStyle(() => ({
    opacity: progress.value >= 0.5 ? 1 : 0,
    transform: [{ perspective: 600 }, { rotateY: `${(progress.value - 1) * 180}deg` }],
  }));

  return (
    <Pressable
      accessible
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, selected: isOpen }}
      disabled={isDisabled}
      hitSlop={2}
      onPress={() => onPress(card.id)}
      style={({ pressed }) => [
        styles.container,
        { width: size, height: Math.round(size * 1.12) },
        pressed && styles.pressed,
      ]}
    >
      <Animated.View style={[styles.face, styles.cover, coverAnimatedStyle]}>
        <View style={styles.coverOuterMark}>
          <View style={styles.coverInnerMark} />
        </View>
      </Animated.View>

      <Animated.View
        style={[styles.face, styles.flagFace, isMatched && styles.matchedFace, flagAnimatedStyle]}
      >
        <FlagVisual visual={card.flag.visual} style={styles.flag} />
        {isMatched ? <View style={styles.matchMarker} /> : null}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  pressed: {
    opacity: 0.88,
    transform: [{ scale: 0.97 }],
  },
  face: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backfaceVisibility: 'hidden',
    borderRadius: borderRadius.md,
    borderWidth: 2,
    overflow: 'hidden',
  },
  cover: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  coverOuterMark: {
    width: '54%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfacePressed,
    borderColor: colors.primary,
    borderRadius: borderRadius.pill,
    borderWidth: 2,
  },
  coverInnerMark: {
    width: '48%',
    aspectRatio: 1,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.pill,
    opacity: 0.72,
  },
  flagFace: {
    backgroundColor: colors.surfacePressed,
    borderColor: colors.primary,
    padding: spacing.xs,
  },
  matchedFace: {
    backgroundColor: colors.successSurface,
    borderColor: colors.success,
  },
  flag: {
    width: '92%',
    height: '72%',
  },
  matchMarker: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
    width: 10,
    height: 10,
    backgroundColor: colors.success,
    borderRadius: borderRadius.pill,
  },
});
