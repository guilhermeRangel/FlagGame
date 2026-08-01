import { useCallback, useEffect, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { setAudioModeAsync, useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import type { AudioPlayer } from 'expo-audio';
import { ScreenContainer } from '@/shared/components/ScreenContainer';
import { AppButton } from '@/shared/components/AppButton';
import { AnimatedFlag } from '@/shared/components/AnimatedFlag';
import welcomeTheme from '@/shared/assets/audio/welcome-theme.wav';
import { ROUTES } from '@/shared/constants/routes';
import { FLAG_ASSETS } from '@/shared/domain/flags';
import { colors, fontSizes, spacing } from '@/shared/theme';
import type { AppNavigationProp } from '@/shared/types/navigation';

function configureMusicPlayer(player: AudioPlayer) {
  player.loop = true;
  player.volume = 0.2;
}

function pauseMusicPlayerSafely(player: AudioPlayer) {
  try {
    player.pause();
  } catch {
    // O player pode já ter sido liberado durante Fast Refresh ou desmontagem.
  }
}

function playMusicPlayerSafely(player: AudioPlayer) {
  try {
    player.play();
  } catch {
    // Falhas de áudio não devem interromper a navegação.
  }
}

export function WelcomeScreen() {
  const navigation = useNavigation<AppNavigationProp>();
  const musicPlayer = useAudioPlayer(welcomeTheme);
  const musicStatus = useAudioPlayerStatus(musicPlayer);

  useEffect(() => {
    configureMusicPlayer(musicPlayer);

    void setAudioModeAsync({ playsInSilentMode: true }).catch(() => undefined);
  }, [musicPlayer]);

  useFocusEffect(
    useCallback(
      () => () => {
        pauseMusicPlayerSafely(musicPlayer);
      },
      [musicPlayer],
    ),
  );

  const handleMusicToggle = useCallback(() => {
    if (musicStatus.playing) {
      pauseMusicPlayerSafely(musicPlayer);
      return;
    }

    playMusicPlayerSafely(musicPlayer);
  }, [musicPlayer, musicStatus.playing]);

  const backgroundFlags = useMemo(
    () => [
      { id: 'br', source: FLAG_ASSETS.br, top: 80, left: 32 },
      { id: 'us', source: FLAG_ASSETS.us, top: 140, left: 260 },
      { id: 'jp', source: FLAG_ASSETS.jp, top: 220, left: 90 },
      { id: 'fr', source: FLAG_ASSETS.fr, top: 320, left: 240 },
      { id: 'de', source: FLAG_ASSETS.de, top: 500, left: 0 },
    ],
    [],
  );

  return (
    <ScreenContainer style={styles.container}>
      <View style={styles.background}>
        {backgroundFlags.map((flag, index) => (
          <View key={flag.id} style={[styles.flagBadge, { top: flag.top, left: flag.left }]}>
            <AnimatedFlag source={flag.source} size={44} duration={1800 + index * 400} />
          </View>
        ))}
        <View style={styles.content}>
          <Text style={styles.title}>Flag World</Text>
          <Text style={styles.subtitle}>
            Prepare-se para explorar bandeiras de forma divertida.
          </Text>
          <View style={styles.actions}>
            <AppButton
              title="Start Game"
              onPress={() => navigation.navigate(ROUTES.GAME_SELECTION)}
            />
            <AppButton
              title="Informações"
              variant="secondary"
              onPress={() => navigation.navigate(ROUTES.INFORMATION)}
            />
          </View>
        </View>
        <View style={styles.musicToggle}>
          <AppButton
            title={musicStatus.playing ? 'Música ligada' : 'Música desligada'}
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
