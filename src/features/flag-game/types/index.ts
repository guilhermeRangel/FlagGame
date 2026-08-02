import { FLAG_ROTATION_SPEEDS } from '@/features/flag-game/constants';

export type RotationSpeed = (typeof FLAG_ROTATION_SPEEDS)[number];

export type FlagSpeedState = Record<string, RotationSpeed>;
