import { FlatList, StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenContainer } from '@/shared/components/ScreenContainer';
import { Header } from '@/shared/components/Header';
import { GameOptionCell } from '@/features/game-selection/components/GameOptionCell';
import { GAME_OPTIONS } from '@/features/game-selection/data/game-options';
import { colors, fontSizes, spacing } from '@/shared/theme';
import type { AppNavigationProp } from '@/shared/types/navigation';
import type { GameOption } from '@/features/game-selection/types';
import { useScreenOrientation } from '@/shared/hooks/useScreenOrientation';
import * as ScreenOrientation from 'expo-screen-orientation';

export function GameSelectionScreen() {
  const navigation = useNavigation<AppNavigationProp>();
  useScreenOrientation(ScreenOrientation.OrientationLock.PORTRAIT);

  const handleOptionPress = (option: GameOption) => {
    if (!option.isAvailable) {
      return;
    }

    navigation.navigate(option.route);
  };

  return (
    <ScreenContainer style={styles.container}>
      <Header title="Selecione o seu jogo" onBack={() => navigation.goBack()} />
      <Text style={styles.subtitle}>Escolha um modo para começar a aventura.</Text>
      <FlatList
        data={GAME_OPTIONS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <GameOptionCell option={item} onPress={handleOptionPress} />}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.xl,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: fontSizes.md,
    marginBottom: spacing.md,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: spacing.xl,
  },
});
