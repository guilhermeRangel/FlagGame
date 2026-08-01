import { useEffect, useMemo, useRef } from 'react';
import {
  AccessibilityInfo,
  FlatList,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useNavigation, usePreventRemove } from '@react-navigation/native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { MemoryCard } from '@/features/memory-game/components/MemoryCard';
import { MemoryDifficultySelector } from '@/features/memory-game/components/MemoryDifficultySelector';
import { MemoryGameHud } from '@/features/memory-game/components/MemoryGameHud';
import { MemoryGameResult } from '@/features/memory-game/components/MemoryGameResult';
import { getMemoryGamePairCount } from '@/features/memory-game/constants/memoryGame.constants';
import { useMemoryGame, useMemoryGameSounds } from '@/features/memory-game/hooks';
import { AppButton } from '@/shared/components/AppButton';
import { EmptyState } from '@/shared/components/EmptyState';
import { Header } from '@/shared/components/Header';
import { ScreenContainer } from '@/shared/components/ScreenContainer';
import { useScreenOrientation } from '@/shared/hooks/useScreenOrientation';
import { borderRadius, colors, fontSizes, spacing } from '@/shared/theme';
import type { AppNavigationProp } from '@/shared/types/navigation';

const MEMORY_GRID_COLUMNS = 4;
const MAX_CARD_WIDTH = 112;
const MIN_CARD_WIDTH = 52;

export function MemoryGameScreen() {
  const navigation = useNavigation<AppNavigationProp>();
  const { width: windowWidth } = useWindowDimensions();
  const { state, startGame, restartGame, selectDifficulty, returnToSetup, flipCard } =
    useMemoryGame();
  const { playMatchSound, stopSounds } = useMemoryGameSounds();
  const shouldReturnToGameList = useRef(false);
  const totalPairs = getMemoryGamePairCount(state.difficulty);
  const isBoardLocked = state.status === 'resolving-mismatch' || state.status === 'finished';

  useScreenOrientation(ScreenOrientation.OrientationLock.PORTRAIT);

  const cardSize = useMemo(() => {
    const availableWidth = Math.min(windowWidth - spacing.lg * 2, 472);
    const gapsWidth = spacing.sm * (MEMORY_GRID_COLUMNS - 1);

    return Math.max(
      MIN_CARD_WIDTH,
      Math.min(MAX_CARD_WIDTH, Math.floor((availableWidth - gapsWidth) / MEMORY_GRID_COLUMNS)),
    );
  }, [windowWidth]);

  useEffect(() => {
    stopSounds();
  }, [state.gameId, stopSounds]);

  useEffect(() => {
    if (state.status !== 'playing' || !state.firstRevealedCardId || state.secondRevealedCardId) {
      return;
    }

    const revealedCard = state.cards.find((card) => card.id === state.firstRevealedCardId);

    if (revealedCard) {
      AccessibilityInfo.announceForAccessibility(
        `${revealedCard.flag.countryName}. Primeira carta revelada. Escolha a segunda carta.`,
      );
    }
  }, [state.cards, state.firstRevealedCardId, state.secondRevealedCardId, state.status]);

  useEffect(() => {
    const feedback = state.feedback;

    if (!feedback) {
      return;
    }

    if (feedback.result === 'match') {
      const matchedCard = state.cards.find((card) => card.id === feedback.cardIds[0]);
      const countryName = matchedCard?.flag.countryName ?? 'bandeira';
      const finishDetail = feedback.isGameFinished
        ? ` Partida concluída em ${feedback.move} jogadas.`
        : '';

      playMatchSound(feedback.id);
      AccessibilityInfo.announceForAccessibility(
        `Par encontrado: ${countryName}. Sequência ${state.streak}.${finishDetail}`,
      );
      return;
    }

    AccessibilityInfo.announceForAccessibility(
      'As bandeiras não formam um par. A sequência voltou a zero.',
    );
  }, [playMatchSound, state.cards, state.feedback, state.streak]);

  useEffect(() => {
    if (state.status === 'ready' && shouldReturnToGameList.current) {
      shouldReturnToGameList.current = false;
      navigation.goBack();
    }
  }, [navigation, state.status]);

  usePreventRemove(state.status !== 'ready', () => {
    returnToSetup();
  });

  const handleHeaderBack = () => {
    if (state.status === 'ready') {
      navigation.goBack();
      return;
    }

    returnToSetup();
  };

  const handleBackToGameList = () => {
    shouldReturnToGameList.current = true;
    returnToSetup();
  };

  const gameHeader = (
    <View style={styles.listHeader}>
      <Text style={styles.instructions}>
        Vire duas cartas por vez e encontre todas as bandeiras iguais. Um erro reinicia a sequência.
      </Text>

      {state.status === 'ready' ? (
        <>
          <MemoryDifficultySelector
            selectedDifficulty={state.difficulty}
            onSelect={selectDifficulty}
          />
          <AppButton title="Iniciar partida" onPress={startGame} />
          <View style={styles.readyHint} accessible>
            <Text style={styles.readyHintTitle}>Como jogar</Text>
            <Text style={styles.readyHintText}>
              A primeira carta permanece aberta até você escolher a segunda. Pares corretos ficam
              visíveis até o fim da partida.
            </Text>
          </View>
        </>
      ) : null}

      {state.status === 'unavailable' ? (
        <View style={styles.unavailable}>
          <EmptyState
            title="Não foi possível montar o tabuleiro."
            message="Tente novamente ou escolha outra dificuldade."
          />
          <AppButton title="Tentar novamente" onPress={restartGame} />
          <AppButton title="Trocar dificuldade" variant="secondary" onPress={returnToSetup} />
        </View>
      ) : null}

      {state.status === 'playing' ||
      state.status === 'resolving-mismatch' ||
      state.status === 'finished' ? (
        <>
          <AppButton
            title={state.status === 'finished' ? 'Jogar novamente' : 'Reiniciar partida'}
            variant={state.status === 'finished' ? 'primary' : 'secondary'}
            onPress={restartGame}
            style={styles.gameAction}
          />
          <MemoryGameHud
            matches={state.matches}
            totalPairs={totalPairs}
            moves={state.moves}
            streak={state.streak}
            bestStreak={state.bestStreak}
            lastMatchedCountryName={state.lastMatchedCountryName}
          />
          {state.status === 'finished' ? (
            <MemoryGameResult
              difficulty={state.difficulty}
              moves={state.moves}
              bestStreak={state.bestStreak}
              onChangeDifficulty={returnToSetup}
              onBackToGames={handleBackToGameList}
            />
          ) : null}
        </>
      ) : null}
    </View>
  );

  return (
    <ScreenContainer style={styles.container}>
      <Header title="Memória das Bandeiras" onBack={handleHeaderBack} />
      <FlatList
        accessibilityLabel="Tabuleiro do jogo da memória"
        columnWrapperStyle={styles.gridRow}
        contentContainerStyle={styles.listContent}
        data={state.cards}
        initialNumToRender={28}
        ItemSeparatorComponent={() => <View style={styles.rowSeparator} />}
        keyExtractor={(card) => `${state.gameId}:${card.id}`}
        ListHeaderComponent={gameHeader}
        numColumns={MEMORY_GRID_COLUMNS}
        removeClippedSubviews={false}
        renderItem={({ item, index }) => (
          <MemoryCard
            boardLocked={isBoardLocked}
            card={item}
            position={index + 1}
            size={cardSize}
            totalCards={state.cards.length}
            onPress={flipCard}
          />
        )}
        showsVerticalScrollIndicator={false}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
  },
  listContent: {
    paddingBottom: spacing.xl,
  },
  listHeader: {
    width: '100%',
  },
  instructions: {
    color: colors.textSecondary,
    fontSize: fontSizes.md,
    lineHeight: 23,
    marginBottom: spacing.md,
  },
  readyHint: {
    width: '100%',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    marginTop: spacing.md,
    padding: spacing.md,
  },
  readyHintTitle: {
    color: colors.primary,
    fontSize: fontSizes.md,
    fontWeight: '800',
    marginBottom: spacing.xs,
  },
  readyHintText: {
    color: colors.textSecondary,
    fontSize: fontSizes.sm,
    lineHeight: 20,
  },
  unavailable: {
    gap: spacing.sm,
  },
  gameAction: {
    marginBottom: spacing.md,
  },
  gridRow: {
    width: '100%',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  rowSeparator: {
    height: spacing.sm,
  },
});
