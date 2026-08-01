import {
  getMemoryGamePairCount,
  isMemoryGameDifficulty,
} from '@/features/memory-game/constants/memoryGame.constants';
import type { MemoryGameCard, MemoryGameDifficulty } from '@/features/memory-game/types';
import { getFlagVisualIdentity } from '@/shared/domain/flags/flagVisualIdentity';
import type { Flag } from '@/shared/domain/flags';

export type RandomSource = () => number;

export type CreateMemoryGameDeckOptions = {
  readonly difficulty: MemoryGameDifficulty;
  readonly random?: RandomSource;
};

function normalizeRandomValue(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, Math.min(0.999_999, value));
}

function shuffleCopy<T>(items: readonly T[], random: RandomSource): T[] {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(normalizeRandomValue(random()) * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled;
}

function normalizeCountryName(countryName: string): string {
  return countryName.trim().normalize('NFKC').toLocaleLowerCase('pt-BR');
}

function getUniqueFlags(flags: readonly Flag[]): Flag[] {
  const flagIds = new Set<string>();
  const countryNames = new Set<string>();

  return flags.filter((flag) => {
    const normalizedCountryName = normalizeCountryName(flag.countryName);

    if (
      !flag.id ||
      !normalizedCountryName ||
      flagIds.has(flag.id) ||
      countryNames.has(normalizedCountryName)
    ) {
      return false;
    }

    flagIds.add(flag.id);
    countryNames.add(normalizedCountryName);
    return true;
  });
}

function selectFlagsWithUniqueVisuals(
  flags: readonly Flag[],
  pairCount: number,
  random: RandomSource,
): Flag[] {
  const selectedVisualIdentities = new Set<string>();
  const selectedFlags: Flag[] = [];

  for (const flag of shuffleCopy(flags, random)) {
    if (selectedFlags.length >= pairCount) {
      break;
    }

    const visualIdentity = getFlagVisualIdentity(flag);

    if (selectedVisualIdentities.has(visualIdentity)) {
      continue;
    }

    selectedVisualIdentities.add(visualIdentity);
    selectedFlags.push(flag);
  }

  return selectedFlags;
}

function createPair(flag: Flag): readonly [MemoryGameCard, MemoryGameCard] {
  const pairId = `pair:${flag.id}`;

  return [
    {
      id: `${pairId}:first`,
      pairId,
      flag,
      status: 'hidden',
    },
    {
      id: `${pairId}:second`,
      pairId,
      flag,
      status: 'hidden',
    },
  ];
}

export function createMemoryGameDeck(
  flags: readonly Flag[],
  options: CreateMemoryGameDeckOptions,
): MemoryGameCard[] {
  if (!isMemoryGameDifficulty(options.difficulty)) {
    return [];
  }

  const random = options.random ?? Math.random;
  const pairCount = getMemoryGamePairCount(options.difficulty);
  const selectedFlags = selectFlagsWithUniqueVisuals(getUniqueFlags(flags), pairCount, random);

  if (selectedFlags.length !== pairCount) {
    return [];
  }

  const cards = selectedFlags.flatMap((flag) => createPair(flag));
  return shuffleCopy(cards, random);
}
