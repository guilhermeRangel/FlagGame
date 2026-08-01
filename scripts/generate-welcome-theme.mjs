import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const sampleRate = 22_050;
const secondsPerStep = 0.375;
const melody = [
  523.25, 659.25, 783.99, 659.25, 587.33, 698.46, 880, 698.46, 493.88, 659.25, 783.99, 659.25, 440,
  587.33, 698.46, 587.33, 523.25, 659.25, 783.99, 1046.5, 880, 783.99, 698.46, 659.25, 587.33,
  698.46, 880, 783.99, 659.25, 587.33, 523.25, 392,
];
const bass = [130.81, 146.83, 123.47, 110];
const durationSeconds = melody.length * secondsPerStep;
const sampleCount = Math.floor(sampleRate * durationSeconds);
const channelCount = 1;
const bytesPerSample = 2;
const dataSize = sampleCount * channelCount * bytesPerSample;
const wav = Buffer.alloc(44 + dataSize);

wav.write('RIFF', 0);
wav.writeUInt32LE(36 + dataSize, 4);
wav.write('WAVE', 8);
wav.write('fmt ', 12);
wav.writeUInt32LE(16, 16);
wav.writeUInt16LE(1, 20);
wav.writeUInt16LE(channelCount, 22);
wav.writeUInt32LE(sampleRate, 24);
wav.writeUInt32LE(sampleRate * channelCount * bytesPerSample, 28);
wav.writeUInt16LE(channelCount * bytesPerSample, 32);
wav.writeUInt16LE(bytesPerSample * 8, 34);
wav.write('data', 36);
wav.writeUInt32LE(dataSize, 40);

for (let index = 0; index < sampleCount; index += 1) {
  const time = index / sampleRate;
  const step = Math.floor(time / secondsPerStep);
  const stepProgress = (time % secondsPerStep) / secondsPerStep;
  const noteFrequency = melody[step];
  const bassFrequency = bass[Math.floor(step / 8) % bass.length];
  const attack = Math.min(1, stepProgress / 0.08);
  const release = Math.min(1, (1 - stepProgress) / 0.18);
  const envelope = Math.max(0, Math.min(attack, release));
  const lead = Math.sin(2 * Math.PI * noteFrequency * time) * 0.24;
  const shimmer = Math.sin(2 * Math.PI * noteFrequency * 2 * time) * 0.055;
  const bassWave = Math.sin(2 * Math.PI * bassFrequency * time) * 0.12;
  const sample = Math.max(-1, Math.min(1, (lead + shimmer) * envelope + bassWave));

  wav.writeInt16LE(Math.round(sample * 32_767), 44 + index * bytesPerSample);
}

const outputPath = resolve('src/shared/assets/audio/welcome-theme.wav');
mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, wav);

console.log(`Tema criado em ${outputPath} (${durationSeconds}s).`);
