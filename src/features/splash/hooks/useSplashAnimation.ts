import { useEffect } from 'react';
import { useSharedValue, withTiming } from 'react-native-reanimated';

export function useSplashAnimation() {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 700 });
    translateY.value = withTiming(0, { duration: 700 });
  }, [opacity, translateY]);

  return { opacity, translateY };
}
