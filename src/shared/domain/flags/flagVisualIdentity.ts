import type { Flag } from './types';

/**
 * IDs cujos assets produzem exatamente os mesmos pixels, mesmo quando o PNG
 * possui compressão ou paleta binária diferente.
 *
 * As entradas continuam disponíveis individualmente, mas nunca devem aparecer
 * juntas em uma escolha ou como pares distintos na mesma partida.
 */
export const FLAG_VISUAL_EQUIVALENCE_GROUPS = [
  ['au', 'hm'],
  ['cp', 'fr', 'mf'],
  ['dg', 'io'],
  ['ea', 'es'],
  ['no', 'sj'],
  ['um', 'us'],
] as const satisfies readonly (readonly string[])[];

const VISUAL_IDENTITY_BY_FLAG_ID = new Map<string, string>(
  FLAG_VISUAL_EQUIVALENCE_GROUPS.flatMap((group) => {
    const identity = `equivalent:${group.join(':')}`;

    return group.map((flagId) => [flagId, identity] as const);
  }),
);

export function getFlagVisualIdentity(flag: Pick<Flag, 'id'>): string {
  return VISUAL_IDENTITY_BY_FLAG_ID.get(flag.id) ?? `flag:${flag.id}`;
}

export function haveEquivalentFlagVisuals(
  firstFlag: Pick<Flag, 'id'>,
  secondFlag: Pick<Flag, 'id'>,
): boolean {
  return getFlagVisualIdentity(firstFlag) === getFlagVisualIdentity(secondFlag);
}
