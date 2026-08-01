import type { ImageSourcePropType } from 'react-native';

export type RotationSpeed = 0 | 1 | 2 | 3 | 4;

export type FlagVisual =
  | {
      type: 'emoji';
      value: string;
    }
  | {
      type: 'asset';
      source: ImageSourcePropType;
    };

export type Flag = {
  id: string;
  countryName: string;
  visual: FlagVisual;
};

export type FlagSpeedState = Record<string, RotationSpeed>;
