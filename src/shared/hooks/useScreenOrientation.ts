import { useEffect } from 'react';
import * as ScreenOrientation from 'expo-screen-orientation';

export function useScreenOrientation(orientation: ScreenOrientation.OrientationLock) {
  useEffect(() => {
    const lockOrientation = async () => {
      try {
        await ScreenOrientation.lockAsync(orientation);
      } catch (error) {
        console.warn('Unable to lock orientation:', error);
      }
    };

    void lockOrientation();

    return () => {
      void ScreenOrientation.unlockAsync().catch((error) => {
        console.warn('Unable to unlock orientation:', error);
      });
    };
  }, [orientation]);
}
