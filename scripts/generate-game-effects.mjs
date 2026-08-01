import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const sampleRate = 22_050;
const bytesPerSample = 2;

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

function createWav(durationSeconds, sampleAt) {
  const sampleCount = Math.floor(sampleRate * durationSeconds);
  const dataSize = sampleCount * bytesPerSample;
  const wav = Buffer.alloc(44 + dataSize);

  wav.write('RIFF', 0);
  wav.writeUInt32LE(36 + dataSize, 4);
  wav.write('WAVE', 8);
  wav.write('fmt ', 12);
  wav.writeUInt32LE(16, 16);
  wav.writeUInt16LE(1, 20);
  wav.writeUInt16LE(1, 22);
  wav.writeUInt32LE(sampleRate, 24);
  wav.writeUInt32LE(sampleRate * bytesPerSample, 28);
  wav.writeUInt16LE(bytesPerSample, 32);
  wav.writeUInt16LE(bytesPerSample * 8, 34);
  wav.write('data', 36);
  wav.writeUInt32LE(dataSize, 40);

  for (let index = 0; index < sampleCount; index += 1) {
    const sample = Math.max(-1, Math.min(1, sampleAt(index / sampleRate)));
    wav.writeInt16LE(Math.round(sample * 32_767), 44 + index * bytesPerSample);
  }

  return wav;
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
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, createWav(effect.duration, effect.sampleAt));
  console.log(`Efeito criado em ${outputPath} (${effect.duration}s).`);
}
