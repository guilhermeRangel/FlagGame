import { MAX_FLAG_ROTATIONS } from '@/features/flag-game/constants';
import type { RotationSpeed } from '@/features/flag-game/types';

export function getNextRotationSpeed(currentSpeed: RotationSpeed): RotationSpeed {
  if (currentSpeed >= MAX_FLAG_ROTATIONS) {
    return MAX_FLAG_ROTATIONS;
  }

  return (currentSpeed + 1) as RotationSpeed;
}
