import type { ImageSourcePropType } from 'react-native';
import type { RootStackParamList } from '@/shared/types/navigation';

export type GameOption = {
  id: string;
  title: string;
  description: string;
  icon?: ImageSourcePropType;
  route?: keyof RootStackParamList;
  isAvailable: boolean;
  badge?: string;
};
