import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { ScreenContainer } from '@/shared/components/ScreenContainer';
import { AnimatedFlag } from '@/shared/components/AnimatedFlag';
import { ROUTES } from '@/shared/constants/routes';
import { FLAG_ASSETS } from '@/shared/domain/flags';
import { colors, fontSizes, spacing } from '@/shared/theme';
import type { AppNavigationProp } from '@/shared/types/navigation';
import { useSplashAnimation } from '@/features/splash/hooks/useSplashAnimation';

export function SplashScreen() {
  const navigation = useNavigation<AppNavigationProp>();
  const { opacity, translateY } = useSplashAnimation();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace(ROUTES.WELCOME);
    }, 3200);

    return () => clearTimeout(timer);
  }, [navigation]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <ScreenContainer style={styles.container}>
      <View style={styles.background}>
        <Animated.View style={[styles.content, animatedStyle]}>
          <Text style={styles.title}>Flag World</Text>
          <Text style={styles.subtitle}>Explore, jogue e descubra bandeiras</Text>
          <View style={styles.flagRow}>
            <AnimatedFlag source={FLAG_ASSETS.br} size={54} duration={2200} />
            <AnimatedFlag source={FLAG_ASSETS.us} size={54} duration={2600} />
            <AnimatedFlag source={FLAG_ASSETS.jp} size={54} duration={2400} />
          </View>
        </Animated.View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
  },
  background: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  title: {
    color: colors.textPrimary,
    fontSize: fontSizes.xxl,
    fontWeight: '800',
    marginBottom: spacing.sm,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: fontSizes.md,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  flagRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
});
