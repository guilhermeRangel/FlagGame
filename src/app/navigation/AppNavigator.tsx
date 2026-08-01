import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SplashScreen } from '@/features/splash/screens/SplashScreen';
import { WelcomeScreen } from '@/features/welcome/screens/WelcomeScreen';
import { InformationScreen } from '@/features/information/screens/InformationScreen';
import { GameSelectionScreen } from '@/features/game-selection/screens/GameSelectionScreen';
import { FlagGameScreen } from '@/features/flag-game/screens/FlagGameScreen';
import type { RootStackParamList } from '@/shared/types/navigation';
import { ROUTES } from '@/shared/constants/routes';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={ROUTES.SPLASH} screenOptions={{ headerShown: false }}>
        <Stack.Screen name={ROUTES.SPLASH} component={SplashScreen} />
        <Stack.Screen name={ROUTES.WELCOME} component={WelcomeScreen} />
        <Stack.Screen name={ROUTES.INFORMATION} component={InformationScreen} />
        <Stack.Screen name={ROUTES.GAME_SELECTION} component={GameSelectionScreen} />
        <Stack.Screen name={ROUTES.FLAG_GAME} component={FlagGameScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
