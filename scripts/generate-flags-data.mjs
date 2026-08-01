import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

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

const output = `import type { Flag } from '@/shared/domain/flags/types';
import { FLAG_ASSETS } from '@/shared/domain/flags/flags.assets';

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

export const FLAG_OPTIONS: readonly Flag[] = [
  ...REGION_FLAGS.map(([code, countryName]) => ({
    id: code.toLowerCase(),
    countryName,
    visual: { type: 'asset' as const, source: FLAG_ASSETS[code.toLowerCase()] },
  })),
  ...SUBDIVISION_FLAGS.map(([id, countryName]) => ({
    id,
    countryName,
    visual: { type: 'asset' as const, source: FLAG_ASSETS[id] },
  })),
];
`;

const outputPath = resolve('src/shared/domain/flags/flags.data.ts');
mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, output);
console.log(`Catálogo criado com ${entries.length + 3} bandeiras.`);
