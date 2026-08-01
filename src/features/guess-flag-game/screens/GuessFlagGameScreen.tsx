import { useEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { ScreenContainer } from '@/shared/components/ScreenContainer';
import { Header } from '@/shared/components/Header';
import { EmptyState } from '@/shared/components/EmptyState';
import { AppButton } from '@/shared/components/AppButton';
import { spacing } from '@/shared/theme';
import { useScreenOrientation } from '@/shared/hooks/useScreenOrientation';
import type { AppNavigationProp } from '@/shared/types/navigation';
import { GuessFlagGameHud } from '@/features/guess-flag-game/components/GuessFlagGameHud';
import { GuessFlagPrompt } from '@/features/guess-flag-game/components/GuessFlagPrompt';
import { GuessFlagOptionButton } from '@/features/guess-flag-game/components/GuessFlagOptionButton';
import { GuessFlagFeedback } from '@/features/guess-flag-game/components/GuessFlagFeedback';
import { GuessFlagGameResult } from '@/features/guess-flag-game/components/GuessFlagGameResult';
import { useGuessFlagGame } from '@/features/guess-flag-game/hooks/useGuessFlagGame';
import { useGuessFlagGameSounds } from '@/features/guess-flag-game/hooks/useGuessFlagGameSounds';
import { getGuessFlagOptionState } from '@/features/guess-flag-game/utils/guessFlagGameRules';

export function GuessFlagGameScreen() {
  const navigation = useNavigation<AppNavigationProp>();
  const { state, currentRound, answerCurrentRound, restartGame } = useGuessFlagGame();
  const { playAnswerFeedback, playGameFinished } = useGuessFlagGameSounds();

  useScreenOrientation(ScreenOrientation.OrientationLock.PORTRAIT);

  useEffect(() => {
    if (state.status === 'showing-feedback' && state.feedback) {
      playAnswerFeedback(state.feedback);
    }
  }, [playAnswerFeedback, state.feedback, state.status]);

  useEffect(() => {
    if (state.status === 'finished') {
      playGameFinished(state.gameId);
    }
  }, [playGameFinished, state.gameId, state.status]);

  const handleBack = () => navigation.goBack();

  if (state.status === 'unavailable' || (!currentRound && state.status !== 'finished')) {
    return (
      <ScreenContainer style={styles.container}>
        <Header title="Qual é a Bandeira?" onBack={handleBack} />
        <View style={styles.emptyContainer}>
          <EmptyState
            title="Não foi possível carregar as bandeiras."
            message="Tente iniciar uma nova partida."
          />
          <AppButton title="Tentar novamente" onPress={restartGame} />
        </View>
      </ScreenContainer>
    );
  }

  if (state.status === 'finished') {
    return (
      <ScreenContainer style={styles.container}>
        <Header title="Qual é a Bandeira?" onBack={handleBack} />
        <ScrollView
          contentContainerStyle={styles.resultContent}
          showsVerticalScrollIndicator={false}
        >
          <GuessFlagGameResult
            score={state.score}
            correctAnswers={state.correctAnswers}
            incorrectAnswers={state.incorrectAnswers}
            bestStreak={state.bestStreak}
            onRestart={restartGame}
            onBack={handleBack}
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
      <Header title="Qual é a Bandeira?" onBack={handleBack} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <GuessFlagGameHud
          currentRound={state.currentRoundIndex + 1}
          totalRounds={state.rounds.length}
          score={state.score}
          correctAnswers={state.correctAnswers}
          streak={state.streak}
        />

        <GuessFlagPrompt
          key={`prompt:${state.gameId}:${currentRound.id}`}
          visual={currentRound.flagVisual}
          tone={promptTone}
        />

        <View style={styles.options}>
          {currentRound.options.map((option) => (
            <GuessFlagOptionButton
              key={option.id}
              option={option}
              state={getGuessFlagOptionState(
                option.id,
                state.selectedOptionId,
                currentRound.correctOptionId,
                state.status,
              )}
              isSelected={state.selectedOptionId === option.id}
              onPress={answerCurrentRound}
            />
          ))}
        </View>

        {state.feedback ? (
          <GuessFlagFeedback key={`feedback:${state.feedback.id}`} feedback={state.feedback} />
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
  resultContent: {
    flexGrow: 1,
  },
  options: {
    gap: spacing.sm,
  },
  emptyContainer: {
    flex: 1,
    paddingBottom: spacing.xl,
  },
});
