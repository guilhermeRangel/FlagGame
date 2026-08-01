import type { RotationSpeed } from '@/features/flag-game/types';

export function getNextRotationSpeed(currentSpeed: RotationSpeed): RotationSpeed {
  if (currentSpeed >= 4) {
    return 4;
  }

  return (currentSpeed + 1) as RotationSpeed;
}
