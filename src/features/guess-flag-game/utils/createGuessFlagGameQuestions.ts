import {
  GUESS_FLAG_DIFFICULTIES,
  getDifficultyRoundDistribution,
} from '@/features/guess-flag-game/constants/guessFlagGame.constants';
import { FLAG_IDS_BY_DIFFICULTY } from '@/features/guess-flag-game/data/flag-difficulty.data';
import type {
  GuessFlagDifficulty,
  GuessFlagOption,
  GuessFlagRound,
} from '@/features/guess-flag-game/types';
import type { Flag } from '@/shared/domain/flags';

type RandomSource = () => number;

export type CreateGuessFlagGameQuestionsOptions = {
  readonly totalRounds: number;
  readonly optionCount: number;
  readonly difficulty: GuessFlagDifficulty;
  readonly random?: RandomSource;
};

type ClassifiedFlag = {
  readonly flag: Flag;
  readonly difficulty: GuessFlagDifficulty;
};

const DIFFICULTY_BY_FLAG_ID = new Map<string, GuessFlagDifficulty>(
  GUESS_FLAG_DIFFICULTIES.flatMap((difficulty) =>
    FLAG_IDS_BY_DIFFICULTY[difficulty].map((flagId) => [flagId, difficulty] as const),
  ),
);

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

function getUniqueClassifiedFlags(flags: readonly Flag[]): ClassifiedFlag[] {
  const ids = new Set<string>();
  const countryNames = new Set<string>();

  return flags.flatMap((flag) => {
    const normalizedName = normalizeCountryName(flag.countryName);
    const difficulty = DIFFICULTY_BY_FLAG_ID.get(flag.id);

    if (
      !flag.id ||
      !normalizedName ||
      !difficulty ||
      ids.has(flag.id) ||
      countryNames.has(normalizedName)
    ) {
      return [];
    }

    ids.add(flag.id);
    countryNames.add(normalizedName);
    return [{ flag, difficulty }];
  });
}

function normalizePositiveInteger(value: number): number {
  if (!Number.isFinite(value) || value <= 0) {
    return 0;
  }

  return Math.floor(value);
}

function isGuessFlagDifficulty(value: unknown): value is GuessFlagDifficulty {
  return GUESS_FLAG_DIFFICULTIES.some((difficulty) => difficulty === value);
}

function getLowerDifficulties(difficulty: GuessFlagDifficulty): GuessFlagDifficulty[] {
  const difficultyIndex = GUESS_FLAG_DIFFICULTIES.indexOf(difficulty);

  return [...GUESS_FLAG_DIFFICULTIES.slice(0, difficultyIndex)].reverse();
}

function getAvailableFlags(
  pools: ReadonlyMap<GuessFlagDifficulty, readonly ClassifiedFlag[]>,
  difficulty: GuessFlagDifficulty,
  selectedFlagIds: ReadonlySet<string>,
): ClassifiedFlag[] {
  return (pools.get(difficulty) ?? []).filter(({ flag }) => !selectedFlagIds.has(flag.id));
}

function selectCorrectFlags(
  flags: readonly ClassifiedFlag[],
  distribution: Readonly<Record<GuessFlagDifficulty, number>>,
  random: RandomSource,
): ClassifiedFlag[] {
  const pools = new Map<GuessFlagDifficulty, readonly ClassifiedFlag[]>(
    GUESS_FLAG_DIFFICULTIES.map((difficulty) => [
      difficulty,
      shuffleCopy(
        flags.filter((classifiedFlag) => classifiedFlag.difficulty === difficulty),
        random,
      ),
    ]),
  );
  const selectedFlagIds = new Set<string>();
  const selectedFlags: ClassifiedFlag[] = [];
  const missingByDifficulty = new Map<GuessFlagDifficulty, number>();

  for (const difficulty of GUESS_FLAG_DIFFICULTIES) {
    const requestedCount = distribution[difficulty];
    const availableFlags = getAvailableFlags(pools, difficulty, selectedFlagIds);
    const primarySelection = availableFlags.slice(0, requestedCount);

    for (const classifiedFlag of primarySelection) {
      selectedFlagIds.add(classifiedFlag.flag.id);
      selectedFlags.push(classifiedFlag);
    }

    missingByDifficulty.set(difficulty, requestedCount - primarySelection.length);
  }

  for (const difficulty of [...GUESS_FLAG_DIFFICULTIES].reverse()) {
    let missingCount = missingByDifficulty.get(difficulty) ?? 0;

    for (const fallbackDifficulty of getLowerDifficulties(difficulty)) {
      if (missingCount === 0) {
        break;
      }

      const fallbackSelection = getAvailableFlags(pools, fallbackDifficulty, selectedFlagIds).slice(
        0,
        missingCount,
      );

      for (const classifiedFlag of fallbackSelection) {
        selectedFlagIds.add(classifiedFlag.flag.id);
        selectedFlags.push(classifiedFlag);
      }

      missingCount -= fallbackSelection.length;
    }
  }

  return shuffleCopy(selectedFlags, random);
}

function createRoundForCorrectFlag(
  correctFlag: ClassifiedFlag,
  allFlags: readonly ClassifiedFlag[],
  optionCount: number,
  roundIndex: number,
  random: RandomSource,
): GuessFlagRound {
  const safeOptionCount = Math.min(optionCount, allFlags.length);
  const correctCountryName = normalizeCountryName(correctFlag.flag.countryName);
  const incorrectFlags = shuffleCopy(
    allFlags.filter(
      (classifiedFlag) =>
        classifiedFlag.difficulty === correctFlag.difficulty &&
        classifiedFlag.flag.id !== correctFlag.flag.id &&
        normalizeCountryName(classifiedFlag.flag.countryName) !== correctCountryName,
    ),
    random,
  ).slice(0, safeOptionCount - 1);

  const options: GuessFlagOption[] = shuffleCopy([correctFlag, ...incorrectFlags], random).map(
    ({ flag }) => ({
      id: flag.id,
      countryName: flag.countryName,
    }),
  );

  return {
    id: `round-${roundIndex + 1}-${correctFlag.flag.id}`,
    flagId: correctFlag.flag.id,
    flagVisual: correctFlag.flag.visual,
    correctOptionId: correctFlag.flag.id,
    correctCountryName: correctFlag.flag.countryName,
    intrinsicDifficulty: correctFlag.difficulty,
    options,
  };
}

export function createGuessFlagRound(
  flags: readonly Flag[],
  optionCount: number,
  random: RandomSource = Math.random,
): GuessFlagRound | undefined {
  const uniqueFlags = getUniqueClassifiedFlags(flags);
  const safeOptionCount = normalizePositiveInteger(optionCount);

  if (uniqueFlags.length === 0 || safeOptionCount === 0) {
    return undefined;
  }

  const viableCorrectFlags = uniqueFlags.filter(
    ({ difficulty }) =>
      uniqueFlags.filter((classifiedFlag) => classifiedFlag.difficulty === difficulty).length >=
      safeOptionCount,
  );
  const [correctFlag] = shuffleCopy(viableCorrectFlags, random);

  if (!correctFlag) {
    return undefined;
  }

  return createRoundForCorrectFlag(correctFlag, uniqueFlags, safeOptionCount, 0, random);
}

export function createGuessFlagGameQuestions(
  flags: readonly Flag[],
  options: CreateGuessFlagGameQuestionsOptions,
): GuessFlagRound[] {
  const uniqueFlags = getUniqueClassifiedFlags(flags);
  const safeOptionCount = normalizePositiveInteger(options.optionCount);
  const availableCountByDifficulty = new Map<GuessFlagDifficulty, number>(
    GUESS_FLAG_DIFFICULTIES.map((difficulty) => [
      difficulty,
      uniqueFlags.filter((classifiedFlag) => classifiedFlag.difficulty === difficulty).length,
    ]),
  );
  const viableCorrectFlags = uniqueFlags.filter(
    ({ difficulty }) => (availableCountByDifficulty.get(difficulty) ?? 0) >= safeOptionCount,
  );
  const safeTotalRounds = Math.min(
    normalizePositiveInteger(options.totalRounds),
    viableCorrectFlags.length,
  );

  if (
    safeTotalRounds === 0 ||
    safeOptionCount === 0 ||
    !isGuessFlagDifficulty(options.difficulty)
  ) {
    return [];
  }

  const random = options.random ?? Math.random;
  const distribution = getDifficultyRoundDistribution(options.difficulty, safeTotalRounds);
  const correctFlags = selectCorrectFlags(viableCorrectFlags, distribution, random);

  return correctFlags.map((correctFlag, index) =>
    createRoundForCorrectFlag(correctFlag, uniqueFlags, safeOptionCount, index, random),
  );
}
