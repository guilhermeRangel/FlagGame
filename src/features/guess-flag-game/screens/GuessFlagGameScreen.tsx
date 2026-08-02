import { useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation, usePreventRemove } from '@react-navigation/native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { ScreenContainer } from '@/shared/components/ScreenContainer';
import { Header } from '@/shared/components/Header';
import { EmptyState } from '@/shared/components/EmptyState';
import { AppButton } from '@/shared/components/AppButton';
import { spacing } from '@/shared/theme';
import { useScreenOrientation } from '@/shared/hooks/useScreenOrientation';
import type { AppNavigationProp } from '@/shared/types/navigation';
import { GuessFlagPrompt } from '@/features/guess-flag-game/components/GuessFlagPrompt';
import { GuessFlagOptionButton } from '@/features/guess-flag-game/components/GuessFlagOptionButton';
import {
  FlagQuizDifficultySelector,
  FlagQuizFeedback,
  FlagQuizGameHud,
  FlagQuizGameResult,
  getFlagQuizOptionState,
  useFlagQuizGame,
} from '@/shared/gameplay/flag-quiz';
import { useFlagQuizScreenEffects } from '@/shared/gameplay/flag-quiz/hooks/useFlagQuizScreenEffects';

export function GuessFlagGameScreen() {
  const navigation = useNavigation<AppNavigationProp>();
  const { state, currentRound, submitAnswer, selectDifficulty, restartGame, changeDifficulty } =
    useFlagQuizGame();
  const shouldReturnToGameList = useRef(false);
  const gameScrollView = useRef<ScrollView>(null);

  useScreenOrientation(ScreenOrientation.OrientationLock.PORTRAIT);
  useFlagQuizScreenEffects({ state, scrollViewRef: gameScrollView });

  useEffect(() => {
    if (state.status === 'selecting-difficulty' && shouldReturnToGameList.current) {
      shouldReturnToGameList.current = false;
      navigation.goBack();
    }
  }, [navigation, state.status]);

  usePreventRemove(state.status !== 'selecting-difficulty', () => {
    changeDifficulty();
  });

  const handleHeaderBack = () => {
    if (state.status === 'selecting-difficulty') {
      navigation.goBack();
      return;
    }

    changeDifficulty();
  };

  const handleBackToGameList = () => {
    shouldReturnToGameList.current = true;
    changeDifficulty();
  };

  if (state.status === 'selecting-difficulty' || !state.difficulty) {
    return (
      <ScreenContainer style={styles.container}>
        <Header title="Qual é a Bandeira?" onBack={handleHeaderBack} />
        <ScrollView
          contentContainerStyle={styles.selectionContent}
          showsVerticalScrollIndicator={false}
        >
          <FlagQuizDifficultySelector onSelect={selectDifficulty} />
        </ScrollView>
      </ScreenContainer>
    );
  }

  if (state.status === 'unavailable' || (!currentRound && state.status !== 'finished')) {
    return (
      <ScreenContainer style={styles.container}>
        <Header title="Qual é a Bandeira?" onBack={handleHeaderBack} />
        <View style={styles.emptyContainer}>
          <EmptyState
            title="Não foi possível carregar as bandeiras."
            message="Tente iniciar uma nova partida."
          />
          <AppButton title="Tentar novamente" onPress={restartGame} />
          <AppButton title="Trocar dificuldade" variant="secondary" onPress={changeDifficulty} />
        </View>
      </ScreenContainer>
    );
  }

  if (state.status === 'finished') {
    return (
      <ScreenContainer style={styles.container}>
        <Header title="Qual é a Bandeira?" onBack={handleHeaderBack} />
        <ScrollView
          contentContainerStyle={styles.resultContent}
          showsVerticalScrollIndicator={false}
        >
          <FlagQuizGameResult
            difficulty={state.difficulty}
            score={state.score}
            correctAnswers={state.correctAnswers}
            incorrectAnswers={state.incorrectAnswers}
            bestStreak={state.bestStreak}
            onRestart={restartGame}
            onChangeDifficulty={changeDifficulty}
            onBack={handleBackToGameList}
          />
        </ScrollView>
      </ScreenContainer>
    );
  }

  if (!currentRound) {
    return null;
  }

  const promptTone = state.feedback
    ? state.feedback.isCorrect
      ? 'correct'
      : 'incorrect'
    : 'neutral';

  return (
    <ScreenContainer style={styles.container}>
      <Header title="Qual é a Bandeira?" onBack={handleHeaderBack} />
      <ScrollView
        ref={gameScrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <FlagQuizGameHud
          difficulty={state.difficulty}
          currentRound={state.currentRoundIndex + 1}
          totalRounds={state.rounds.length}
          score={state.score}
          correctAnswers={state.correctAnswers}
          streak={state.streak}
        />

        <GuessFlagPrompt
          key={`prompt:${state.gameId}:${currentRound.id}`}
          visual={currentRound.correctFlag.visual}
          tone={promptTone}
        />

        <View style={styles.options}>
          {currentRound.options.map((option) => (
            <GuessFlagOptionButton
              key={option.id}
              option={option}
              state={getFlagQuizOptionState(
                option.id,
                state.selectedOptionId,
                currentRound.correctFlag.id,
                state.status,
              )}
              isSelected={state.selectedOptionId === option.id}
              onPress={submitAnswer}
            />
          ))}
        </View>

        {state.feedback ? (
          <FlagQuizFeedback key={`feedback:${state.feedback.id}`} feedback={state.feedback} />
        ) : null}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.xl,
  },
  content: {
    flexGrow: 1,
    gap: spacing.md,
    paddingBottom: spacing.xl,
  },
  selectionContent: {
    flexGrow: 1,
    paddingBottom: spacing.xl,
  },
  resultContent: {
    flexGrow: 1,
  },
  options: {
    gap: spacing.sm,
  },
  emptyContainer: {
    flex: 1,
    gap: spacing.sm,
    paddingBottom: spacing.xl,
  },
});
