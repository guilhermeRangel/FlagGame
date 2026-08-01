import type { Flag } from '@/features/flag-game/types';

const shuffleOffset = 0.5;
const initialFlagsAmount = 30;

export const FLAG_OPTIONS: Flag[] = [
  { id: 'brazil', countryName: 'Brasil', visual: { type: 'emoji', value: '🇧🇷' } },
  { id: 'argentina', countryName: 'Argentina', visual: { type: 'emoji', value: '🇦🇷' } },
  { id: 'usa', countryName: 'Estados Unidos', visual: { type: 'emoji', value: '🇺🇸' } },
  { id: 'canada', countryName: 'Canadá', visual: { type: 'emoji', value: '🇨🇦' } },
  { id: 'mexico', countryName: 'México', visual: { type: 'emoji', value: '🇲🇽' } },
  { id: 'japan', countryName: 'Japão', visual: { type: 'emoji', value: '🇯🇵' } },
  { id: 'china', countryName: 'China', visual: { type: 'emoji', value: '🇨🇳' } },
  { id: 'south-korea', countryName: 'Coreia do Sul', visual: { type: 'emoji', value: '🇰🇷' } },
  { id: 'india', countryName: 'Índia', visual: { type: 'emoji', value: '🇮🇳' } },
  { id: 'australia', countryName: 'Austrália', visual: { type: 'emoji', value: '🇦🇺' } },
  { id: 'italy', countryName: 'Itália', visual: { type: 'emoji', value: '🇮🇹' } },
  { id: 'france', countryName: 'França', visual: { type: 'emoji', value: '🇫🇷' } },
  { id: 'germany', countryName: 'Alemanha', visual: { type: 'emoji', value: '🇩🇪' } },
  { id: 'spain', countryName: 'Espanha', visual: { type: 'emoji', value: '🇪🇸' } },
  { id: 'portugal', countryName: 'Portugal', visual: { type: 'emoji', value: '🇵🇹' } },
  { id: 'uk', countryName: 'Reino Unido', visual: { type: 'emoji', value: '🇬🇧' } },
  { id: 'netherlands', countryName: 'Holanda', visual: { type: 'emoji', value: '🇳🇱' } },
  { id: 'switzerland', countryName: 'Suíça', visual: { type: 'emoji', value: '🇨🇭' } },
  { id: 'sweden', countryName: 'Suécia', visual: { type: 'emoji', value: '🇸🇪' } },
  { id: 'norway', countryName: 'Noruega', visual: { type: 'emoji', value: '🇳🇴' } },
  { id: 'russia', countryName: 'Rússia', visual: { type: 'emoji', value: '🇷🇺' } },
  { id: 'egypt', countryName: 'Egito', visual: { type: 'emoji', value: '🇪🇬' } },
  { id: 'south-africa', countryName: 'África do Sul', visual: { type: 'emoji', value: '🇿🇦' } },
  { id: 'nigeria', countryName: 'Nigéria', visual: { type: 'emoji', value: '🇳🇬' } },
  { id: 'morocco', countryName: 'Marrocos', visual: { type: 'emoji', value: '🇲🇦' } },
  { id: 'chile', countryName: 'Chile', visual: { type: 'emoji', value: '🇨🇱' } },
  { id: 'colombia', countryName: 'Colômbia', visual: { type: 'emoji', value: '🇨🇴' } },
  { id: 'peru', countryName: 'Peru', visual: { type: 'emoji', value: '🇵🇪' } },
  { id: 'uruguay', countryName: 'Uruguai', visual: { type: 'emoji', value: '🇺🇾' } },
  { id: 'greece', countryName: 'Grécia', visual: { type: 'emoji', value: '🇬🇷' } },
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
