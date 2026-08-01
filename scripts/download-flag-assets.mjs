import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const TWEMOJI_REVISION = 'b6b55fef1e8636b540a6d016a4729ca8cdf2e60b';
const TWEMOJI_BASE_URL = `https://raw.githubusercontent.com/jdecked/twemoji/${TWEMOJI_REVISION}/assets/72x72`;
const MAX_CONCURRENT_DOWNLOADS = 16;
const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDirectory, '..');
const catalogPath = resolve(projectRoot, 'src/shared/domain/flags/flags.data.ts');
const assetsDirectory = resolve(projectRoot, 'src/shared/assets/flags');
const assetMapPath = resolve(projectRoot, 'src/shared/domain/flags/flags.assets.ts');

function getRegionFlagEmoji(regionCode) {
  const regionalIndicatorA = 0x1f1e6;
  const asciiUppercaseA = 65;
  const codePoints = [...regionCode].map(
    (character) => regionalIndicatorA + character.charCodeAt(0) - asciiUppercaseA,
  );

  return String.fromCodePoint(...codePoints);
}

function getSubdivisionFlagEmoji(tag) {
  const tagBase = 0xe0000;
  const cancelTag = 0xe007f;
  const codePoints = [...tag].map((character) => tagBase + character.charCodeAt(0));

  return String.fromCodePoint(0x1f3f4, ...codePoints, cancelTag);
}

function getTwemojiFileName(emoji) {
  return [...emoji].map((character) => character.codePointAt(0).toString(16)).join('-');
}

function parseCatalog(source) {
  const regions = [...source.matchAll(/^\s*\['([A-Z]{2})',/gm)].map((match) => ({
    id: match[1].toLowerCase(),
    emoji: getRegionFlagEmoji(match[1]),
  }));
  const subdivisions = [
    ...source.matchAll(/^\s*\['(gb-[a-z]+)',\s*'[^']+',\s*'([a-z]+)'\],?$/gm),
  ].map((match) => ({
    id: match[1],
    emoji: getSubdivisionFlagEmoji(match[2]),
  }));
  const entries = [...regions, ...subdivisions];

  if (entries.length !== 262 || new Set(entries.map(({ id }) => id)).size !== entries.length) {
    throw new Error(`Esperadas 262 bandeiras únicas, mas foram encontradas ${entries.length}.`);
  }

  return entries;
}

function isValidPng(buffer) {
  return buffer.length > PNG_SIGNATURE.length && buffer.subarray(0, 8).equals(PNG_SIGNATURE);
}

async function downloadFlag({ id, emoji }) {
  const fileName = `${getTwemojiFileName(emoji)}.png`;
  const response = await fetch(`${TWEMOJI_BASE_URL}/${fileName}`);

  if (!response.ok) {
    throw new Error(`Falha ao baixar ${id}: HTTP ${response.status}.`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());

  if (!isValidPng(buffer)) {
    throw new Error(`O arquivo recebido para ${id} não é um PNG válido.`);
  }

  await writeFile(resolve(assetsDirectory, `${id}.png`), buffer);
}

async function downloadInBatches(entries) {
  for (let index = 0; index < entries.length; index += MAX_CONCURRENT_DOWNLOADS) {
    await Promise.all(entries.slice(index, index + MAX_CONCURRENT_DOWNLOADS).map(downloadFlag));
  }
}

function createAssetMap(entries) {
  const imports = entries
    .map(({ id }, index) => `import flag${index} from '@/shared/assets/flags/${id}.png';`)
    .join('\n');
  const rows = entries.map(({ id }, index) => `  ${JSON.stringify(id)}: flag${index},`).join('\n');

  return `${imports}

import type { FlagAssetSource } from '@/shared/domain/flags/types';

export const FLAG_ASSETS: Readonly<Record<string, FlagAssetSource>> = {
${rows}
};
`;
}

const source = await readFile(catalogPath, 'utf8');
const entries = parseCatalog(source);

await mkdir(assetsDirectory, { recursive: true });
await downloadInBatches(entries);
await writeFile(assetMapPath, createAssetMap(entries));

console.log(`Baixadas e mapeadas ${entries.length} bandeiras locais do Twemoji.`);
