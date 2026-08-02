import { FLAG_QUIZ_DIFFICULTIES } from '@/shared/gameplay/flag-quiz/constants/flagQuiz.constants';
import {
  EXPECTED_FLAG_QUIZ_CLASSIFICATION_COUNT,
  FLAG_IDS_BY_DIFFICULTY,
} from '@/shared/gameplay/flag-quiz/data/flag-difficulty.data';
import type { Flag } from '@/shared/domain/flags';

type FlagDifficultyClassificationValidation = {
  readonly isValid: boolean;
  readonly expectedCount: number;
  readonly catalogCount: number;
  readonly classifiedCount: number;
  readonly duplicateCatalogIds: readonly string[];
  readonly duplicateClassificationIds: readonly string[];
  readonly unknownIds: readonly string[];
  readonly unclassifiedIds: readonly string[];
};

function findDuplicateIds(ids: readonly string[]): string[] {
  const seenIds = new Set<string>();
  const duplicateIds = new Set<string>();

  for (const id of ids) {
    if (seenIds.has(id)) {
      duplicateIds.add(id);
    }

    seenIds.add(id);
  }

  return [...duplicateIds].sort();
}

function validateFlagDifficultyClassification(
  flags: readonly Pick<Flag, 'id'>[],
): FlagDifficultyClassificationValidation {
  const catalogIds = flags.map(({ id }) => id);
  const classifiedIds = FLAG_QUIZ_DIFFICULTIES.flatMap(
    (difficulty) => FLAG_IDS_BY_DIFFICULTY[difficulty],
  );
  const catalogIdSet = new Set(catalogIds);
  const classifiedIdSet = new Set(classifiedIds);
  const duplicateCatalogIds = findDuplicateIds(catalogIds);
  const duplicateClassificationIds = findDuplicateIds(classifiedIds);
  const unknownIds = [...classifiedIdSet].filter((id) => !catalogIdSet.has(id)).sort();
  const unclassifiedIds = [...catalogIdSet].filter((id) => !classifiedIdSet.has(id)).sort();
  const hasExpectedCount =
    catalogIds.length === EXPECTED_FLAG_QUIZ_CLASSIFICATION_COUNT &&
    classifiedIds.length === EXPECTED_FLAG_QUIZ_CLASSIFICATION_COUNT;

  return {
    isValid:
      hasExpectedCount &&
      duplicateCatalogIds.length === 0 &&
      duplicateClassificationIds.length === 0 &&
      unknownIds.length === 0 &&
      unclassifiedIds.length === 0,
    expectedCount: EXPECTED_FLAG_QUIZ_CLASSIFICATION_COUNT,
    catalogCount: catalogIds.length,
    classifiedCount: classifiedIds.length,
    duplicateCatalogIds,
    duplicateClassificationIds,
    unknownIds,
    unclassifiedIds,
  };
}

export function assertFlagDifficultyClassification(flags: readonly Pick<Flag, 'id'>[]): void {
  const validation = validateFlagDifficultyClassification(flags);

  if (!validation.isValid) {
    throw new Error(
      [
        'Classificação de dificuldade das bandeiras inválida.',
        `Esperado: ${validation.expectedCount}.`,
        `Catálogo: ${validation.catalogCount}.`,
        `Classificados: ${validation.classifiedCount}.`,
        `IDs duplicados no catálogo: ${validation.duplicateCatalogIds.join(', ') || 'nenhum'}.`,
        `Duplicados: ${validation.duplicateClassificationIds.join(', ') || 'nenhum'}.`,
        `Desconhecidos: ${validation.unknownIds.join(', ') || 'nenhum'}.`,
        `Sem classificação: ${validation.unclassifiedIds.join(', ') || 'nenhum'}.`,
      ].join(' '),
    );
  }
}
