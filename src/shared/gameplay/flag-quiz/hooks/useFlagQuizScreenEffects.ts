import { useEffect } from 'react';
import type { RefObject } from 'react';
import type { ScrollView } from 'react-native';
import type { FlagQuizGameState } from '@/shared/gameplay/flag-quiz/types';
import { useFlagQuizGameSounds } from './useFlagQuizGameSounds';

type UseFlagQuizScreenEffectsOptions = {
  readonly state: FlagQuizGameState;
  readonly scrollViewRef: RefObject<ScrollView | null>;
};

export function useFlagQuizScreenEffects({
  state,
  scrollViewRef,
}: UseFlagQuizScreenEffectsOptions) {
  const { playAnswerFeedback, playGameFinished } = useFlagQuizGameSounds();

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
    if (state.status !== 'playing' && state.status !== 'showing-feedback') {
      return undefined;
    }

    const animationFrame = requestAnimationFrame(() => {
      if (state.status === 'showing-feedback') {
        scrollViewRef.current?.scrollToEnd({ animated: true });
        return;
      }

      scrollViewRef.current?.scrollTo({ y: 0, animated: false });
    });

    return () => cancelAnimationFrame(animationFrame);
  }, [scrollViewRef, state.currentRoundIndex, state.status]);
}
