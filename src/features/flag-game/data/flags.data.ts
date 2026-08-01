import { FLAG_OPTIONS } from '@/shared/domain/flags';
import type { Flag } from '@/shared/domain/flags';

const shuffleOffset = 0.5;
const initialFlagsAmount = 30;

export { FLAG_OPTIONS };

export function getRandomFlags(flags: readonly Flag[], amount: number): Flag[] {
  if (amount <= 0) {
    return [];
  }

  const shuffled = [...flags].sort(() => Math.random() - shuffleOffset);

  if (amount >= flags.length) {
    return shuffled;
  }

  return shuffled.slice(0, amount);
}

export const initialFlagGameAmount = initialFlagsAmount;
