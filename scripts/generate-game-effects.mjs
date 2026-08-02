import { resolve } from 'node:path';

import { createPcm16MonoWav, writeWavFile } from './wav-utils.mjs';

const sampleRate = 22_050;

function noteEnvelope(progress) {
  const attack = Math.min(1, progress / 0.08);
  const release = Math.min(1, (1 - progress) / 0.16);
  return Math.max(0, Math.min(attack, release));
}

function createSequenceSampler(frequencies, durationSeconds, volume) {
  const noteDuration = durationSeconds / frequencies.length;

  return (time) => {
    const noteIndex = Math.min(frequencies.length - 1, Math.floor(time / noteDuration));
    const noteTime = time - noteIndex * noteDuration;
    const progress = noteTime / noteDuration;
    const frequency = frequencies[noteIndex];
    const fundamental = Math.sin(2 * Math.PI * frequency * noteTime);
    const harmonic = Math.sin(2 * Math.PI * frequency * 2 * noteTime) * 0.18;

    return (fundamental + harmonic) * noteEnvelope(progress) * volume;
  };
}

const effects = [
  {
    filename: 'correct-answer.wav',
    duration: 0.45,
    sampleAt: createSequenceSampler([523.25, 659.25, 783.99], 0.45, 0.42),
  },
  {
    filename: 'incorrect-answer.wav',
    duration: 0.5,
    sampleAt: createSequenceSampler([329.63, 220], 0.5, 0.3),
  },
  {
    filename: 'game-finished.wav',
    duration: 1.1,
    sampleAt: createSequenceSampler([523.25, 659.25, 783.99, 1046.5], 1.1, 0.38),
  },
];

for (const effect of effects) {
  const outputPath = resolve('src/shared/assets/audio/game-effects', effect.filename);
  const wav = createPcm16MonoWav({
    durationSeconds: effect.duration,
    sampleAt: effect.sampleAt,
    sampleRate,
  });
  writeWavFile(outputPath, wav);
  console.log(`Efeito criado em ${outputPath} (${effect.duration}s).`);
}
