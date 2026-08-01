import type { Flag } from '@/shared/domain/flags';

export interface FlagRandomizer {
  randomize(flags: readonly Flag[], amount: number): Flag[];
}

export class SimpleFlagRandomizer implements FlagRandomizer {
  randomize(flags: readonly Flag[], amount: number): Flag[] {
    if (amount <= 0) {
      return [];
    }

    if (amount >= flags.length) {
      return [...flags];
    }

    const shuffled = [...flags].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, amount);
  }
}
