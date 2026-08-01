import {
  FLAG_QUIZ_DIFFICULTIES,
  getDifficultyRoundDistribution,
} from '@/shared/gameplay/flag-quiz/constants/flagQuiz.constants';
import { FLAG_IDS_BY_DIFFICULTY } from '@/shared/gameplay/flag-quiz/data/flag-difficulty.data';
import type {
  FlagQuizChoice,
  FlagQuizDifficulty,
  FlagQuizRound,
} from '@/shared/gameplay/flag-quiz/types';
import { getFlagVisualIdentity } from '@/shared/gameplay/flag-quiz/utils/flagVisualIdentity';
import type { Flag } from '@/shared/domain/flags';

export type RandomSource = () => number;

export type CreateFlagQuizQuestionsOptions = {
  readonly totalRounds: number;
  readonly optionCount: number;
  readonly difficulty: FlagQuizDifficulty;
  readonly random?: RandomSource;
};

type ClassifiedFlag = {
  readonly flag: Flag;
  readonly difficulty: FlagQuizDifficulty;
};

const DIFFICULTY_BY_FLAG_ID = new Map<string, FlagQuizDifficulty>(
  FLAG_QUIZ_DIFFICULTIES.flatMap((difficulty) =>
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

function isFlagQuizDifficulty(value: unknown): value is FlagQuizDifficulty {
  return FLAG_QUIZ_DIFFICULTIES.some((difficulty) => difficulty === value);
}

function getLowerDifficulties(difficulty: FlagQuizDifficulty): FlagQuizDifficulty[] {
  const difficultyIndex = FLAG_QUIZ_DIFFICULTIES.indexOf(difficulty);

  return [...FLAG_QUIZ_DIFFICULTIES.slice(0, difficultyIndex)].reverse();
}

function getAvailableFlags(
  pools: ReadonlyMap<FlagQuizDifficulty, readonly ClassifiedFlag[]>,
  difficulty: FlagQuizDifficulty,
  selectedVisualIdentities: ReadonlySet<string>,
): ClassifiedFlag[] {
  return (pools.get(difficulty) ?? []).filter(
    ({ flag }) => !selectedVisualIdentities.has(getFlagVisualIdentity(flag)),
  );
}

function takeFlagsWithUniqueVisuals(
  flags: readonly ClassifiedFlag[],
  count: number,
  selectedVisualIdentities: Set<string>,
): ClassifiedFlag[] {
  const selectedFlags: ClassifiedFlag[] = [];

  for (const classifiedFlag of flags) {
    if (selectedFlags.length >= count) {
      break;
    }

    const visualIdentity = getFlagVisualIdentity(classifiedFlag.flag);

    if (selectedVisualIdentities.has(visualIdentity)) {
      continue;
    }

    selectedVisualIdentities.add(visualIdentity);
    selectedFlags.push(classifiedFlag);
  }

  return selectedFlags;
}

function countUniqueVisuals(flags: readonly ClassifiedFlag[]): number {
  return new Set(flags.map(({ flag }) => getFlagVisualIdentity(flag))).size;
}

function selectCorrectFlags(
  flags: readonly ClassifiedFlag[],
  distribution: Readonly<Record<FlagQuizDifficulty, number>>,
  random: RandomSource,
): ClassifiedFlag[] {
  const pools = new Map<FlagQuizDifficulty, readonly ClassifiedFlag[]>(
    FLAG_QUIZ_DIFFICULTIES.map((difficulty) => [
      difficulty,
      shuffleCopy(
        flags.filter((classifiedFlag) => classifiedFlag.difficulty === difficulty),
        random,
      ),
    ]),
  );
  const selectedVisualIdentities = new Set<string>();
  const selectedFlags: ClassifiedFlag[] = [];
  const missingByDifficulty = new Map<FlagQuizDifficulty, number>();

  for (const difficulty of FLAG_QUIZ_DIFFICULTIES) {
    const requestedCount = distribution[difficulty];
    const availableFlags = getAvailableFlags(pools, difficulty, selectedVisualIdentities);
    const primarySelection = takeFlagsWithUniqueVisuals(
      availableFlags,
      requestedCount,
      selectedVisualIdentities,
    );

    selectedFlags.push(...primarySelection);

    missingByDifficulty.set(difficulty, requestedCount - primarySelection.length);
  }

  for (const difficulty of [...FLAG_QUIZ_DIFFICULTIES].reverse()) {
    let missingCount = missingByDifficulty.get(difficulty) ?? 0;

    for (const fallbackDifficulty of getLowerDifficulties(difficulty)) {
      if (missingCount === 0) {
        break;
      }

      const fallbackSelection = takeFlagsWithUniqueVisuals(
        getAvailableFlags(pools, fallbackDifficulty, selectedVisualIdentities),
        missingCount,
        selectedVisualIdentities,
      );

      selectedFlags.push(...fallbackSelection);

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
): FlagQuizRound {
  const safeOptionCount = Math.min(optionCount, allFlags.length);
  const correctCountryName = normalizeCountryName(correctFlag.flag.countryName);
  const correctVisualIdentity = getFlagVisualIdentity(correctFlag.flag);
  const distractorVisualIdentities = new Set<string>([correctVisualIdentity]);
  const incorrectFlags = takeFlagsWithUniqueVisuals(
    shuffleCopy(
      allFlags.filter(
        (classifiedFlag) =>
          classifiedFlag.difficulty === correctFlag.difficulty &&
          classifiedFlag.flag.id !== correctFlag.flag.id &&
          normalizeCountryName(classifiedFlag.flag.countryName) !== correctCountryName &&
          getFlagVisualIdentity(classifiedFlag.flag) !== correctVisualIdentity,
      ),
      random,
    ),
    safeOptionCount - 1,
    distractorVisualIdentities,
  );

  const options: FlagQuizChoice[] = shuffleCopy([correctFlag, ...incorrectFlags], random).map(
    ({ flag }) => flag,
  );

  return {
    id: `round-${roundIndex + 1}-${correctFlag.flag.id}`,
    correctFlag: correctFlag.flag,
    intrinsicDifficulty: correctFlag.difficulty,
    options,
  };
}

function hasEnoughSameTierOptions(
  correctFlag: ClassifiedFlag,
  allFlags: readonly ClassifiedFlag[],
  optionCount: number,
): boolean {
  return (
    countUniqueVisuals(
      allFlags.filter(
        (classifiedFlag) =>
          classifiedFlag.difficulty === correctFlag.difficulty &&
          getFlagVisualIdentity(classifiedFlag.flag) !== getFlagVisualIdentity(correctFlag.flag),
      ),
    ) >=
    optionCount - 1
  );
}

export function createFlagQuizRound(
  flags: readonly Flag[],
  optionCount: number,
  random: RandomSource = Math.random,
): FlagQuizRound | undefined {
  const uniqueFlags = getUniqueClassifiedFlags(flags);
  const safeOptionCount = normalizePositiveInteger(optionCount);

  if (uniqueFlags.length === 0 || safeOptionCount === 0) {
    return undefined;
  }

  const viableCorrectFlags = uniqueFlags.filter((classifiedFlag) =>
    hasEnoughSameTierOptions(classifiedFlag, uniqueFlags, safeOptionCount),
  );
  const [correctFlag] = shuffleCopy(viableCorrectFlags, random);

  if (!correctFlag) {
    return undefined;
  }

  return createRoundForCorrectFlag(correctFlag, uniqueFlags, safeOptionCount, 0, random);
}

export function createFlagQuizQuestions(
  flags: readonly Flag[],
  options: CreateFlagQuizQuestionsOptions,
): FlagQuizRound[] {
  const uniqueFlags = getUniqueClassifiedFlags(flags);
  const safeOptionCount = normalizePositiveInteger(options.optionCount);
  const viableCorrectFlags = uniqueFlags.filter((classifiedFlag) =>
    hasEnoughSameTierOptions(classifiedFlag, uniqueFlags, safeOptionCount),
  );
  const safeTotalRounds = Math.min(
    normalizePositiveInteger(options.totalRounds),
    countUniqueVisuals(viableCorrectFlags),
  );

  if (safeTotalRounds === 0 || safeOptionCount === 0 || !isFlagQuizDifficulty(options.difficulty)) {
    return [];
  }

  const random = options.random ?? Math.random;
  const distribution = getDifficultyRoundDistribution(options.difficulty, safeTotalRounds);
  const correctFlags = selectCorrectFlags(viableCorrectFlags, distribution, random);

  return correctFlags.map((correctFlag, index) =>
    createRoundForCorrectFlag(correctFlag, uniqueFlags, safeOptionCount, index, random),
  );
}
