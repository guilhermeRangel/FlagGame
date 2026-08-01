import { useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation, usePreventRemove } from '@react-navigation/native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { AppButton } from '@/shared/components/AppButton';
import { EmptyState } from '@/shared/components/EmptyState';
import { Header } from '@/shared/components/Header';
import { ScreenContainer } from '@/shared/components/ScreenContainer';
import { FLAG_OPTIONS } from '@/shared/domain/flags';
import {
  FLAG_QUIZ_OPTION_COUNT,
  FLAG_QUIZ_TOTAL_ROUNDS,
  FlagQuizDifficultySelector,
  FlagQuizFeedback,
  FlagQuizGameHud,
  FlagQuizGameResult,
  getFlagQuizOptionState,
  useFlagQuizGame,
  useFlagQuizGameSounds,
} from '@/shared/gameplay/flag-quiz';
import { useScreenOrientation } from '@/shared/hooks/useScreenOrientation';
import { spacing } from '@/shared/theme';
import type { AppNavigationProp } from '@/shared/types/navigation';
import { FindFlagOptionCard } from '@/features/find-flag-game/components/FindFlagOptionCard';
import { FindFlagPrompt } from '@/features/find-flag-game/components/FindFlagPrompt';

const FIND_FLAG_FEEDBACK_DURATION_MS = 1_800;

export function FindFlagGameScreen() {
  const navigation = useNavigation<AppNavigationProp>();
  const { state, currentRound, submitAnswer, selectDifficulty, restartGame, changeDifficulty } =
    useFlagQuizGame({
      flags: FLAG_OPTIONS,
      totalRounds: FLAG_QUIZ_TOTAL_ROUNDS,
      optionCount: FLAG_QUIZ_OPTION_COUNT,
      feedbackDurationMs: FIND_FLAG_FEEDBACK_DURATION_MS,
    });
  const { playAnswerFeedback, playGameFinished } = useFlagQuizGameSounds();
  const shouldReturnToGameList = useRef(false);
  const gameScrollView = useRef<ScrollView>(null);

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

  useEffect(() => {
    if (state.status === 'selecting-difficulty' && shouldReturnToGameList.current) {
      shouldReturnToGameList.current = false;
      navigation.goBack();
    }
  }, [navigation, state.status]);

  useEffect(() => {
    if (state.status !== 'playing' && state.status !== 'showing-feedback') {
      return undefined;
    }

    const animationFrame = requestAnimationFrame(() => {
      if (state.status === 'showing-feedback') {
        gameScrollView.current?.scrollToEnd({ animated: true });
        return;
      }

      gameScrollView.current?.scrollTo({ y: 0, animated: false });
    });

    return () => cancelAnimationFrame(animationFrame);
  }, [state.currentRoundIndex, state.status]);

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
        <Header title="Encontre a Bandeira" onBack={handleHeaderBack} />
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
        <Header title="Encontre a Bandeira" onBack={handleHeaderBack} />
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
        <Header title="Encontre a Bandeira" onBack={handleHeaderBack} />
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
  const shouldRevealAnswers = state.status === 'showing-feedback';

  return (
    <ScreenContainer style={styles.container}>
      <Header title="Encontre a Bandeira" onBack={handleHeaderBack} />
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

        <FindFlagPrompt
          key={`prompt:${state.gameId}:${currentRound.id}`}
          countryName={currentRound.correctFlag.countryName}
          tone={promptTone}
        />

        <View style={styles.options}>
          {currentRound.options.map((option, index) => (
            <FindFlagOptionCard
              key={option.id}
              option={option}
              position={index + 1}
              optionCount={currentRound.options.length}
              state={getFlagQuizOptionState(
                option.id,
                state.selectedOptionId,
                currentRound.correctFlag.id,
                state.status,
              )}
              isSelected={state.selectedOptionId === option.id}
              revealName={shouldRevealAnswers}
              onPress={submitAnswer}
            />
          ))}
        </View>

        {state.feedback ? (
          <FlagQuizFeedback
            key={`feedback:${state.feedback.id}`}
            feedback={state.feedback}
            detail={
              state.feedback.isCorrect
                ? `+${state.feedback.pointsAwarded} pontos`
                : `Resposta correta: ${state.feedback.correctFlag.countryName}. A opção está destacada em verde.`
            }
          />
        ) : null}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
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
    width: '100%',
    gap: spacing.sm,
  },
  emptyContainer: {
    flex: 1,
    gap: spacing.sm,
    paddingBottom: spacing.xl,
  },
});
