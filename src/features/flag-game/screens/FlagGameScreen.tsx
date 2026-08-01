import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenContainer } from '@/shared/components/ScreenContainer';
import { Header } from '@/shared/components/Header';
import { AppButton } from '@/shared/components/AppButton';
import { InteractiveFlagCard } from '@/features/flag-game/components/InteractiveFlagCard';
import { FLAG_OPTIONS, getRandomFlags, initialFlagGameAmount } from '@/features/flag-game/data/flags.data';
import { getNextRotationSpeed } from '@/features/flag-game/utils/rotation';
import { colors, fontSizes, spacing } from '@/shared/theme';
import type { AppNavigationProp } from '@/shared/types/navigation';
import type { FlagSpeedState, RotationSpeed } from '@/features/flag-game/types';
import { useScreenOrientation } from '@/shared/hooks/useScreenOrientation';
import * as ScreenOrientation from 'expo-screen-orientation';

export function FlagGameScreen() {
  const navigation = useNavigation<AppNavigationProp>();
  const [selectedFlags, setSelectedFlags] = useState(() => getRandomFlags(FLAG_OPTIONS, initialFlagGameAmount));
  const [speeds, setSpeeds] = useState<FlagSpeedState>({});

  useScreenOrientation(ScreenOrientation.OrientationLock.PORTRAIT);

  const handleFlagPress = (flagId: string) => {
    setSpeeds((current) => {
      const currentSpeed = current[flagId] ?? 0;
      const nextSpeed = getNextRotationSpeed(currentSpeed);
      return {
        ...current,
        [flagId]: nextSpeed,
      };
    });
  };

  const handleReset = () => {
    setSpeeds({});
  };

  const handleShuffle = () => {
    setSelectedFlags(getRandomFlags(FLAG_OPTIONS, initialFlagGameAmount));
    setSpeeds({});
  };

  const summary = useMemo(() => {
    const activeCount = Object.values(speeds).filter((speed) => speed > 0).length;
    return activeCount === 0 ? 'Nenhuma bandeira em rotação' : `${activeCount} bandeira(s) em rotação`;
  }, [speeds]);

  return (
    <ScreenContainer style={styles.container}>
      <Header title="Bandeiras Giratórias" onBack={() => navigation.goBack()} />
      <Text style={styles.instructions}>
        Toque em uma bandeira para fazê-la girar. Continue tocando para aumentar sua velocidade.
      </Text>
      <Text style={styles.summary}>{summary}</Text>
      <View style={styles.actions}>
        <AppButton title="Resetar bandeiras" variant="secondary" onPress={handleReset} />
        <AppButton title="Sortear novamente" onPress={handleShuffle} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {selectedFlags.map((flag) => (
            <View key={flag.id} style={styles.gridItem}>
              <InteractiveFlagCard
                flag={flag}
                speed={(speeds[flag.id] ?? 0) as RotationSpeed}
                onPress={handleFlagPress}
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
  },
  instructions: {
    color: colors.textSecondary,
    fontSize: fontSizes.md,
    marginBottom: spacing.sm,
  },
  summary: {
    color: colors.primary,
    marginBottom: spacing.md,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '18%',
    marginBottom: spacing.md,
  },
});
