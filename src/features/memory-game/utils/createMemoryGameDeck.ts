import {
  getMemoryGamePairCount,
  isMemoryGameDifficulty,
} from '@/features/memory-game/constants/memoryGame.constants';
import type { MemoryGameCard, MemoryGameDifficulty } from '@/features/memory-game/types';
import { getFlagVisualIdentity } from '@/shared/domain/flags';
import type { Flag } from '@/shared/domain/flags';
import { normalizeCountryName, shuffleCopy } from '@/shared/utils';
import type { RandomSource } from '@/shared/utils';

type CreateMemoryGameDeckOptions = {
  readonly difficulty: MemoryGameDifficulty;
  readonly random?: RandomSource;
};

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
