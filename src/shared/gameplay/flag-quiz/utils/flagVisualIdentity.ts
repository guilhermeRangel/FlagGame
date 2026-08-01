import type { Flag } from '@/shared/domain/flags';

/**
 * IDs cujo catálogo usa exatamente a mesma imagem.
 *
 * As entradas continuam disponíveis individualmente, mas nunca podem aparecer
 * juntas nas alternativas ou como respostas diferentes na mesma partida.
 */
export const FLAG_VISUAL_EQUIVALENCE_GROUPS = [
  ['cp', 'fr', 'mf'],
  ['no', 'sj'],
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
