export type RandomSource = () => number;

function normalizeRandomValue(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, Math.min(0.999_999, value));
}

export function shuffleCopy<T>(items: readonly T[], random: RandomSource): T[] {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(normalizeRandomValue(random()) * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled;
}
