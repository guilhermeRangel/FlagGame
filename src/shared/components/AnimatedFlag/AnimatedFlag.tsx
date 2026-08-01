import { useEffect } from 'react';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { Image, StyleSheet } from 'react-native';
import { colors, spacing } from '@/shared/theme';
import type { FlagAssetSource } from '@/shared/domain/flags';

type AnimatedFlagProps = {
  source: FlagAssetSource;
  size?: number;
  duration?: number;
};

export function AnimatedFlag({ source, size = 48, duration = 2200 }: AnimatedFlagProps) {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(withTiming(360, { duration, easing: Easing.linear }), -1, false);

    return () => {
      rotation.value = 0;
    };
  }, [duration, rotation]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <Animated.View style={[styles.flag, { width: size, height: size }, animatedStyle]}>
      <Image source={source} style={styles.image} resizeMode="contain" accessible={false} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  flag: {
    borderRadius: 16,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    margin: spacing.sm,
  },
  image: {
    width: '78%',
    height: '78%',
  },
});
