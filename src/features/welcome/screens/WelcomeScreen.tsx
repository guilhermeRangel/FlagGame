import { useCallback, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenContainer } from '@/shared/components/ScreenContainer';
import { AppButton } from '@/shared/components/AppButton';
import { AnimatedFlag } from '@/shared/components/AnimatedFlag';
import { ROUTES } from '@/shared/constants/routes';
import { colors, fontSizes, spacing } from '@/shared/theme';
import type { AppNavigationProp } from '@/shared/types/navigation';

export function WelcomeScreen() {
  const navigation = useNavigation<AppNavigationProp>();
  const [isMusicEnabled, setIsMusicEnabled] = useState(true);

  const handleMusicToggle = useCallback(() => {
    setIsMusicEnabled((current) => !current);
  }, []);

  const backgroundFlags = useMemo(
    () => [
      { emoji: '🇧🇷', top: 80, left: 32 },
      { emoji: '🇺🇸', top: 140, left: 260 },
      { emoji: '🇯🇵', top: 220, left: 90 },
      { emoji: '🇫🇷', top: 320, left: 240 },
    ],
    [],
  );

  return (
    <ScreenContainer style={styles.container}>
      <View style={styles.background}>
        {backgroundFlags.map((flag, index) => (
          <View key={`${flag.emoji}-${index}`} style={[styles.flagBadge, { top: flag.top, left: flag.left }]}> 
            <AnimatedFlag emoji={flag.emoji} size={44} duration={1800 + index * 400} />
          </View>
        ))}
        <View style={styles.content}>
          <Text style={styles.title}>Flag World</Text>
          <Text style={styles.subtitle}>Prepare-se para explorar bandeiras de forma divertida.</Text>
          <View style={styles.actions}>
            <AppButton title="Start Game" onPress={() => navigation.navigate(ROUTES.GAME_SELECTION)} />
            <AppButton title="Informações" variant="secondary" onPress={() => navigation.navigate(ROUTES.INFORMATION)} />
          </View>
        </View>
        <View style={styles.musicToggle}>
          <AppButton
            title={isMusicEnabled ? '🔊 Música' : '🔈 Silencioso'}
            variant="secondary"
            onPress={handleMusicToggle}
          />
        </View>
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
    position: 'relative',
  },
  flagBadge: {
    position: 'absolute',
    opacity: 0.8,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
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
  actions: {
    gap: spacing.sm,
    width: '100%',
    maxWidth: 320,
  },
  musicToggle: {
    position: 'absolute',
    bottom: spacing.xl,
    right: spacing.lg,
  },
});
