import { useCallback, useEffect, useRef } from 'react';
import { setAudioModeAsync, useAudioPlayer } from 'expo-audio';
import type { AudioPlayer } from 'expo-audio';
import correctAnswerSound from '@/shared/assets/audio/game-effects/correct-answer.wav';

function configureEffectPlayer(player: AudioPlayer) {
  player.loop = false;
  player.volume = 0.35;
}

function pauseSafely(player: AudioPlayer) {
  try {
    player.pause();
  } catch {
    // Uma falha do aparelho não deve interromper a partida.
  }
}

export function useMemoryGameSounds() {
  const correctPlayer = useAudioPlayer(correctAnswerSound);
  const activeRequest = useRef(0);
  const isMounted = useRef(true);
  const lastMatchEventId = useRef<string | undefined>(undefined);

  const stopSounds = useCallback(() => {
    activeRequest.current += 1;
    pauseSafely(correctPlayer);
  }, [correctPlayer]);

  useEffect(() => {
    isMounted.current = true;
    configureEffectPlayer(correctPlayer);

    void setAudioModeAsync({
      playsInSilentMode: true,
      interruptionMode: 'mixWithOthers',
      shouldPlayInBackground: false,
    }).catch(() => undefined);

    return () => {
      isMounted.current = false;
      stopSounds();
    };
  }, [correctPlayer, stopSounds]);

  const playMatchSound = useCallback(
    (eventId: string) => {
      if (lastMatchEventId.current === eventId) {
        return;
      }

      lastMatchEventId.current = eventId;
      const requestId = activeRequest.current + 1;
      activeRequest.current = requestId;
      pauseSafely(correctPlayer);

      void correctPlayer
        .seekTo(0)
        .then(() => {
          if (isMounted.current && activeRequest.current === requestId) {
            correctPlayer.play();
          }
        })
        .catch(() => undefined);
    },
    [correctPlayer],
  );

  return { playMatchSound, stopSounds };
}
