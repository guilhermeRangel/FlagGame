import { FLAG_OPTIONS } from '@/shared/domain/flags';
import type { Flag } from '@/shared/domain/flags';
import { shuffleCopy } from '@/shared/utils';
import type { RandomSource } from '@/shared/utils';

const initialFlagsAmount = 30;

export { FLAG_OPTIONS };

export function getRandomFlags(
  flags: readonly Flag[],
  amount: number,
  random: RandomSource = Math.random,
): Flag[] {
  if (amount <= 0) {
    return [];
  }

  const shuffled = shuffleCopy(flags, random);

  if (amount >= flags.length) {
    return shuffled;
  }

  return shuffled.slice(0, amount);
}

export const initialFlagGameAmount = initialFlagsAmount;
