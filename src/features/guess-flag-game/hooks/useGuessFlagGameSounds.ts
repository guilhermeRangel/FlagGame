import { useCallback, useEffect, useRef } from 'react';
import { setAudioModeAsync, useAudioPlayer } from 'expo-audio';
import type { AudioPlayer } from 'expo-audio';
import correctAnswerSound from '@/shared/assets/audio/game-effects/correct-answer.wav';
import incorrectAnswerSound from '@/shared/assets/audio/game-effects/incorrect-answer.wav';
import gameFinishedSound from '@/shared/assets/audio/game-effects/game-finished.wav';
import type { GuessFlagAnswerFeedback } from '@/features/guess-flag-game/types';

function configureEffectPlayer(player: AudioPlayer, volume: number) {
  player.loop = false;
  player.volume = volume;
}

function pauseSafely(player: AudioPlayer) {
  try {
    player.pause();
  } catch {
    // Falhas de áudio não devem interromper a partida.
  }
}

export function useGuessFlagGameSounds() {
  const correctPlayer = useAudioPlayer(correctAnswerSound);
  const incorrectPlayer = useAudioPlayer(incorrectAnswerSound);
  const finishedPlayer = useAudioPlayer(gameFinishedSound);
  const activeRequest = useRef(0);
  const isMounted = useRef(true);
  const lastAnswerId = useRef<string | undefined>(undefined);
  const lastFinishedGameId = useRef<number | undefined>(undefined);

  const stopAll = useCallback(() => {
    pauseSafely(correctPlayer);
    pauseSafely(incorrectPlayer);
    pauseSafely(finishedPlayer);
  }, [correctPlayer, finishedPlayer, incorrectPlayer]);

  useEffect(() => {
    isMounted.current = true;
    configureEffectPlayer(correctPlayer, 0.35);
    configureEffectPlayer(incorrectPlayer, 0.28);
    configureEffectPlayer(finishedPlayer, 0.38);

    void setAudioModeAsync({
      playsInSilentMode: true,
      interruptionMode: 'mixWithOthers',
      shouldPlayInBackground: false,
    }).catch(() => undefined);

    return () => {
      isMounted.current = false;
      activeRequest.current += 1;
      stopAll();
    };
  }, [correctPlayer, finishedPlayer, incorrectPlayer, stopAll]);

  const playExclusive = useCallback(
    async (targetPlayer: AudioPlayer) => {
      const requestId = activeRequest.current + 1;
      activeRequest.current = requestId;
      stopAll();

      try {
        await targetPlayer.seekTo(0);

        if (isMounted.current && activeRequest.current === requestId) {
          targetPlayer.play();
        }
      } catch {
        // O jogo continua normalmente mesmo se o aparelho rejeitar o áudio.
      }
    },
    [stopAll],
  );

  const playAnswerFeedback = useCallback(
    (feedback: GuessFlagAnswerFeedback) => {
      if (lastAnswerId.current === feedback.id) {
        return;
      }

      lastAnswerId.current = feedback.id;
      const player = feedback.isCorrect ? correctPlayer : incorrectPlayer;
      void playExclusive(player);
    },
    [correctPlayer, incorrectPlayer, playExclusive],
  );

  const playGameFinished = useCallback(
    (gameId: number) => {
      if (lastFinishedGameId.current === gameId) {
        return;
      }

      lastFinishedGameId.current = gameId;
      void playExclusive(finishedPlayer);
    },
    [finishedPlayer, playExclusive],
  );

  return { playAnswerFeedback, playGameFinished };
}
