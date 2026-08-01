import { ROUTES } from '@/shared/constants/routes';
import type { GameOption } from '@/features/game-selection/types';

export const GAME_OPTIONS: GameOption[] = [
  {
    id: 'spinning-flags',
    title: 'Bandeiras Giratórias',
    description: 'Toque nas bandeiras e altere sua velocidade.',
    route: ROUTES.FLAG_GAME,
    isAvailable: true,
  },
  {
    id: 'guess-flag',
    title: 'Qual é a Bandeira?',
    description: 'Observe a bandeira e escolha o país correto.',
    route: ROUTES.GUESS_FLAG_GAME,
    isAvailable: true,
  },
  {
    id: 'discover-country',
    title: 'Descubra o País',
    description: 'Em breve você poderá descobrir países pelo desenho.',
    isAvailable: false,
    badge: 'Em breve',
  },
  {
    id: 'memory',
    title: 'Memória das Bandeiras',
    description: 'Em breve você poderá testar sua memória.',
    isAvailable: false,
    badge: 'Em breve',
  },
  {
    id: 'capitals',
    title: 'Capitais do Mundo',
    description: 'Em breve você poderá explorar capitais.',
    isAvailable: false,
    badge: 'Em breve',
  },
  {
    id: 'continent-flags',
    title: 'Bandeiras por Continente',
    description: 'Em breve você poderá filtrar por continente.',
    isAvailable: false,
    badge: 'Em breve',
  },
  {
    id: 'timed-challenge',
    title: 'Desafio Contra o Tempo',
    description: 'Em breve você poderá competir com o relógio.',
    isAvailable: false,
    badge: 'Em breve',
  },
  {
    id: 'flag-colors',
    title: 'Cores das Bandeiras',
    description: 'Em breve você poderá identificar cores.',
    isAvailable: false,
    badge: 'Em breve',
  },
  {
    id: 'survival',
    title: 'Modo Sobrevivência',
    description: 'Em breve você poderá enfrentar sequência de desafios.',
    isAvailable: false,
    badge: 'Em breve',
  },
  {
    id: 'world-collection',
    title: 'Coleção Mundial',
    description: 'Em breve você poderá expandir sua coleção.',
    isAvailable: false,
    badge: 'Em breve',
  },
];
