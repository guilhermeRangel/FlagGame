import type { ImageSourcePropType } from 'react-native';
import type { RootStackParamList } from '@/shared/types/navigation';

type BaseGameOption = {
  id: string;
  title: string;
  description: string;
  icon?: ImageSourcePropType;
};

export type GameOption =
  | (BaseGameOption & {
      route: keyof RootStackParamList;
      isAvailable: true;
      badge?: never;
    })
  | (BaseGameOption & {
      route?: never;
      isAvailable: false;
      badge?: string;
    });
