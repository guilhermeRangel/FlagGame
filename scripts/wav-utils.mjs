import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

const CHANNEL_COUNT = 1;
const BYTES_PER_SAMPLE = 2;
const WAV_HEADER_SIZE = 44;

export function createPcm16MonoWav({ durationSeconds, sampleAt, sampleRate }) {
  const sampleCount = Math.floor(sampleRate * durationSeconds);
  const dataSize = sampleCount * CHANNEL_COUNT * BYTES_PER_SAMPLE;
  const wav = Buffer.alloc(WAV_HEADER_SIZE + dataSize);

  wav.write('RIFF', 0);
  wav.writeUInt32LE(36 + dataSize, 4);
  wav.write('WAVE', 8);
  wav.write('fmt ', 12);
  wav.writeUInt32LE(16, 16);
  wav.writeUInt16LE(1, 20);
  wav.writeUInt16LE(CHANNEL_COUNT, 22);
  wav.writeUInt32LE(sampleRate, 24);
  wav.writeUInt32LE(sampleRate * CHANNEL_COUNT * BYTES_PER_SAMPLE, 28);
  wav.writeUInt16LE(CHANNEL_COUNT * BYTES_PER_SAMPLE, 32);
  wav.writeUInt16LE(BYTES_PER_SAMPLE * 8, 34);
  wav.write('data', 36);
  wav.writeUInt32LE(dataSize, 40);

  for (let index = 0; index < sampleCount; index += 1) {
    const sample = Math.max(-1, Math.min(1, sampleAt(index / sampleRate)));
    wav.writeInt16LE(Math.round(sample * 32_767), WAV_HEADER_SIZE + index * BYTES_PER_SAMPLE);
  }

  return wav;
}

export function writeWavFile(outputPath, wav) {
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, wav);
}
