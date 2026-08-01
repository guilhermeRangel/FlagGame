import type { Flag } from '@/shared/domain/flags';
import type { GuessFlagOption, GuessFlagRound } from '@/features/guess-flag-game/types';

type RandomSource = () => number;

function shuffleCopy<T>(items: readonly T[], random: RandomSource): T[] {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const nextRandomValue = random();
    const randomValue = Number.isFinite(nextRandomValue)
      ? Math.max(0, Math.min(0.999_999, nextRandomValue))
      : 0;
    const swapIndex = Math.floor(randomValue * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled;
}

function normalizeCountryName(countryName: string): string {
  return countryName.trim().normalize('NFKC').toLocaleLowerCase('pt-BR');
}

function getUniqueFlags(flags: readonly Flag[]): Flag[] {
  const ids = new Set<string>();
  const countryNames = new Set<string>();

  return flags.filter((flag) => {
    const normalizedName = normalizeCountryName(flag.countryName);

    if (!flag.id || !normalizedName || ids.has(flag.id) || countryNames.has(normalizedName)) {
      return false;
    }

    ids.add(flag.id);
    countryNames.add(normalizedName);
    return true;
  });
}

function normalizePositiveInteger(value: number): number {
  if (!Number.isFinite(value) || value <= 0) {
    return 0;
  }

  return Math.floor(value);
}

function createRoundForCorrectFlag(
  correctFlag: Flag,
  allFlags: readonly Flag[],
  optionCount: number,
  roundIndex: number,
  random: RandomSource,
): GuessFlagRound {
  const safeOptionCount = Math.min(optionCount, allFlags.length);
  const correctCountryName = normalizeCountryName(correctFlag.countryName);
  const incorrectFlags = shuffleCopy(
    allFlags.filter(
      (flag) =>
        flag.id !== correctFlag.id && normalizeCountryName(flag.countryName) !== correctCountryName,
    ),
    random,
  ).slice(0, Math.max(0, safeOptionCount - 1));

  const options: GuessFlagOption[] = shuffleCopy([correctFlag, ...incorrectFlags], random).map(
    (flag) => ({
      id: flag.id,
      countryName: flag.countryName,
    }),
  );

  return {
    id: `round-${roundIndex + 1}-${correctFlag.id}`,
    flagId: correctFlag.id,
    flagVisual: correctFlag.visual,
    correctOptionId: correctFlag.id,
    correctCountryName: correctFlag.countryName,
    options,
  };
}

export function createGuessFlagRound(
  flags: readonly Flag[],
  optionCount: number,
  random: RandomSource = Math.random,
): GuessFlagRound | undefined {
  const uniqueFlags = getUniqueFlags(flags);
  const safeOptionCount = normalizePositiveInteger(optionCount);

  if (uniqueFlags.length === 0 || safeOptionCount === 0) {
    return undefined;
  }

  const [correctFlag] = shuffleCopy(uniqueFlags, random);
  return createRoundForCorrectFlag(correctFlag, uniqueFlags, safeOptionCount, 0, random);
}

export function createGuessFlagGameQuestions(
  flags: readonly Flag[],
  totalRounds: number,
  optionCount: number,
  random: RandomSource = Math.random,
): GuessFlagRound[] {
  const uniqueFlags = getUniqueFlags(flags);
  const safeTotalRounds = Math.min(normalizePositiveInteger(totalRounds), uniqueFlags.length);
  const safeOptionCount = normalizePositiveInteger(optionCount);

  if (safeTotalRounds === 0 || safeOptionCount === 0) {
    return [];
  }

  const correctFlags = shuffleCopy(uniqueFlags, random).slice(0, safeTotalRounds);

  return correctFlags.map((correctFlag, index) =>
    createRoundForCorrectFlag(correctFlag, uniqueFlags, safeOptionCount, index, random),
  );
}
