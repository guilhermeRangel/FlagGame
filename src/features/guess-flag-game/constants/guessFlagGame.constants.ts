import type { GuessFlagDifficulty } from '@/features/guess-flag-game/types';

export const GUESS_FLAG_OPTION_COUNT = 3;
export const GUESS_FLAG_TOTAL_ROUNDS = 10;
export const ANSWER_FEEDBACK_DURATION_MS = 1200;

export const BASE_CORRECT_ANSWER_POINTS = 100;
export const STREAK_BONUS_THRESHOLD = 3;
export const STREAK_BONUS_POINTS = 25;

export const GUESS_FLAG_DIFFICULTIES: readonly GuessFlagDifficulty[] = [
  'easy',
  'medium',
  'hard',
  'expert',
];

type DifficultyRoundDistribution = Readonly<Record<GuessFlagDifficulty, number>>;

type GuessFlagDifficultyConfig = {
  readonly label: string;
  readonly description: string;
  readonly examples: string;
  readonly multiplier: number;
  readonly multiplierLabel: string;
  readonly roundDistribution: DifficultyRoundDistribution;
};

const EMPTY_DISTRIBUTION: DifficultyRoundDistribution = {
  easy: 0,
  medium: 0,
  hard: 0,
  expert: 0,
};

export const DIFFICULTY_CONFIG: Readonly<Record<GuessFlagDifficulty, GuessFlagDifficultyConfig>> = {
  easy: {
    label: 'Fácil',
    description: 'Bandeiras muito presentes no Brasil e no mundo.',
    examples: 'Brasil, Estados Unidos e Japão',
    multiplier: 1,
    multiplierLabel: '×1',
    roundDistribution: { easy: 10, medium: 0, hard: 0, expert: 0 },
  },
  medium: {
    label: 'Médio',
    description: 'Combina famosas com outras vistas em esportes, notícias e viagens.',
    examples: 'Camarões, Catar e Tailândia',
    multiplier: 1.2,
    multiplierLabel: '×1,2',
    roundDistribution: { easy: 3, medium: 7, hard: 0, expert: 0 },
  },
  hard: {
    label: 'Difícil',
    description: 'Prioriza países de menor exposição para testar seu repertório.',
    examples: 'Jordânia, Benin e Quirguistão',
    multiplier: 1.6,
    multiplierLabel: '×1,6',
    roundDistribution: { easy: 1, medium: 3, hard: 6, expert: 0 },
  },
  expert: {
    label: 'Especialista',
    description: 'Prioriza territórios, dependências, subdivisões e ilhas raras.',
    examples: 'Pitcairn, Tokelau e Ilha de Clipperton',
    multiplier: 2,
    multiplierLabel: '×2',
    roundDistribution: { easy: 1, medium: 1, hard: 3, expert: 5 },
  },
};

function normalizeRoundCount(totalRounds: number): number {
  if (!Number.isFinite(totalRounds) || totalRounds <= 0) {
    return 0;
  }

  return Math.floor(totalRounds);
}

export function getDifficultyMultiplier(difficulty: GuessFlagDifficulty): number {
  return DIFFICULTY_CONFIG[difficulty].multiplier;
}

export function getDifficultyRoundDistribution(
  difficulty: GuessFlagDifficulty,
  totalRounds: number,
): DifficultyRoundDistribution {
  const safeTotalRounds = normalizeRoundCount(totalRounds);

  if (safeTotalRounds === 0) {
    return EMPTY_DISTRIBUTION;
  }

  const baseDistribution = DIFFICULTY_CONFIG[difficulty].roundDistribution;
  const baseTotal = Object.values(baseDistribution).reduce((total, count) => total + count, 0);
  const scaledEntries = GUESS_FLAG_DIFFICULTIES.map((tier, order) => {
    const exactCount = (baseDistribution[tier] / baseTotal) * safeTotalRounds;

    return {
      tier,
      order,
      count: Math.floor(exactCount),
      remainder: exactCount - Math.floor(exactCount),
    };
  });
  let remainingRounds =
    safeTotalRounds - scaledEntries.reduce((total, entry) => total + entry.count, 0);

  for (const entry of [...scaledEntries].sort(
    (first, second) => second.remainder - first.remainder || first.order - second.order,
  )) {
    if (remainingRounds === 0) {
      break;
    }

    if (baseDistribution[entry.tier] > 0) {
      entry.count += 1;
      remainingRounds -= 1;
    }
  }

  return Object.fromEntries(
    scaledEntries.map(({ tier, count }) => [tier, count]),
  ) as DifficultyRoundDistribution;
}
