import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { ROUTES } from '@/shared/constants/routes';

export type RootStackParamList = {
  [ROUTES.SPLASH]: undefined;
  [ROUTES.WELCOME]: undefined;
  [ROUTES.INFORMATION]: undefined;
  [ROUTES.GAME_SELECTION]: undefined;
  [ROUTES.FLAG_GAME]: undefined;
};

export type AppNavigationProp = NativeStackNavigationProp<RootStackParamList>;
export type AppRouteProp<RouteName extends keyof RootStackParamList> = RouteProp<
  RootStackParamList,
  RouteName
>;
