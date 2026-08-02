import { resolve } from 'node:path';

import { createPcm16MonoWav, writeWavFile } from './wav-utils.mjs';

const sampleRate = 22_050;
const secondsPerStep = 0.375;
const melody = [
  523.25, 659.25, 783.99, 659.25, 587.33, 698.46, 880, 698.46, 493.88, 659.25, 783.99, 659.25, 440,
  587.33, 698.46, 587.33, 523.25, 659.25, 783.99, 1046.5, 880, 783.99, 698.46, 659.25, 587.33,
  698.46, 880, 783.99, 659.25, 587.33, 523.25, 392,
];
const bass = [130.81, 146.83, 123.47, 110];
const durationSeconds = melody.length * secondsPerStep;
const sampleAt = (time) => {
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
  return (lead + shimmer) * envelope + bassWave;
};

const outputPath = resolve('src/shared/assets/audio/welcome-theme.wav');
const wav = createPcm16MonoWav({ durationSeconds, sampleAt, sampleRate });
writeWavFile(outputPath, wav);

console.log(`Tema criado em ${outputPath} (${durationSeconds}s).`);
