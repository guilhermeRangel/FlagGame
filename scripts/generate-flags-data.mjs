import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const sourcePath = process.argv[2];

if (!sourcePath) {
  throw new Error('Informe o caminho do emoji-test.txt oficial do Unicode.');
}

const source = readFileSync(sourcePath, 'utf8');
const names = new Intl.DisplayNames(['pt-BR'], { type: 'region' });
const entries = [];
let isCountryFlagSection = false;

for (const line of source.split('\n')) {
  if (line === '# subgroup: country-flag') {
    isCountryFlagSection = true;
    continue;
  }

  if (isCountryFlagSection && line.startsWith('# subgroup:')) {
    break;
  }

  if (!isCountryFlagSection || !line.includes('; fully-qualified')) {
    continue;
  }

  const codePoints = line
    .split(';')[0]
    .trim()
    .split(/\s+/)
    .map((value) => Number.parseInt(value, 16));
  const code = codePoints
    .map((codePoint) => String.fromCharCode(65 + codePoint - 0x1f1e6))
    .join('');

  entries.push([code, names.of(code)]);
}

if (entries.length !== 259) {
  throw new Error(`Esperadas 259 bandeiras regionais, mas foram encontradas ${entries.length}.`);
}

const rows = entries
  .map(([code, name]) => `  [${JSON.stringify(code)}, ${JSON.stringify(name)}],`)
  .join('\n');

const output = `import type { Flag } from '@/features/flag-game/types';

const shuffleOffset = 0.5;
const initialFlagsAmount = 30;
const regionalIndicatorA = 0x1f1e6;
const asciiUppercaseA = 65;
const tagBase = 0xe0000;
const cancelTag = 0xe007f;

type RegionFlagEntry = readonly [code: string, countryName: string];
type SubdivisionFlagEntry = readonly [id: string, countryName: string, tag: string];

const REGION_FLAGS: readonly RegionFlagEntry[] = [
${rows}
];

const SUBDIVISION_FLAGS: readonly SubdivisionFlagEntry[] = [
  ['gb-eng', 'Inglaterra', 'gbeng'],
  ['gb-sct', 'Escócia', 'gbsct'],
  ['gb-wls', 'País de Gales', 'gbwls'],
];

function getRegionFlagEmoji(regionCode: string): string {
  const codePoints = [...regionCode].map(
    (character) => regionalIndicatorA + character.charCodeAt(0) - asciiUppercaseA,
  );

  return String.fromCodePoint(...codePoints);
}

function getSubdivisionFlagEmoji(tag: string): string {
  const codePoints = [...tag].map((character) => tagBase + character.charCodeAt(0));
  return String.fromCodePoint(0x1f3f4, ...codePoints, cancelTag);
}

export const FLAG_OPTIONS: Flag[] = [
  ...REGION_FLAGS.map(([code, countryName]) => ({
    id: code.toLowerCase(),
    countryName,
    visual: { type: 'emoji' as const, value: getRegionFlagEmoji(code) },
  })),
  ...SUBDIVISION_FLAGS.map(([id, countryName, tag]) => ({
    id,
    countryName,
    visual: { type: 'emoji' as const, value: getSubdivisionFlagEmoji(tag) },
  })),
];

export function getRandomFlags(flags: readonly Flag[], amount: number): Flag[] {
  if (amount <= 0) {
    return [];
  }

  const shuffled = [...flags].sort(() => Math.random() - shuffleOffset);

  if (amount >= flags.length) {
    return shuffled;
  }

  return shuffled.slice(0, amount);
}

export const initialFlagGameAmount = initialFlagsAmount;
`;

writeFileSync(resolve('src/features/flag-game/data/flags.data.ts'), output);
console.log(`Catálogo criado com ${entries.length + 3} bandeiras.`);
