import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ROUTES } from '@/shared/constants/routes';

export type RootStackParamList = {
  [ROUTES.SPLASH]: undefined;
  [ROUTES.WELCOME]: undefined;
  [ROUTES.INFORMATION]: undefined;
  [ROUTES.GAME_SELECTION]: undefined;
  [ROUTES.FLAG_GAME]: undefined;
  [ROUTES.GUESS_FLAG_GAME]: undefined;
  [ROUTES.FIND_FLAG_GAME]: undefined;
  [ROUTES.MEMORY_GAME]: undefined;
};

export type AppNavigationProp = NativeStackNavigationProp<RootStackParamList>;
