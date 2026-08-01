import { useEffect } from 'react';
import * as ScreenOrientation from 'expo-screen-orientation';

export function useScreenOrientation(orientation: ScreenOrientation.OrientationLock) {
  useEffect(() => {
    let isMounted = true;

    const lockOrientation = async () => {
      try {
        await ScreenOrientation.lockAsync(orientation);
      } catch (error) {
        console.warn('Unable to lock orientation:', error);
      }
    };

    void lockOrientation();

    return () => {
      if (!isMounted) {
        return;
      }

      void ScreenOrientation.unlockAsync().catch((error) => {
        console.warn('Unable to unlock orientation:', error);
      });
    };
  }, [orientation]);
}
