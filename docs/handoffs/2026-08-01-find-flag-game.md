# Handoff da sessão — Encontre a Bandeira

Data: 2026-08-01

## Objetivo

Implementar a terceira modalidade invertendo o quiz existente: a pergunta mostra o nome do país, território ou entidade, enquanto as três respostas são bandeiras. A classificação, distribuição, pontuação, estado, sons e componentes realmente comuns foram extraídos para um núcleo compartilhado, preservando Expo SDK 54 e o comportamento do jogo “Qual é a Bandeira?”.

## Resultado entregue

- Terceiro card habilitado como **Encontre a Bandeira**, com rota tipada `FindFlagGame`.
- Quatro dificuldades, dez rodadas e três alternativas por rodada.
- Prompt “Escolha a bandeira correta” com o nome da entidade em destaque.
- Três cards verticais full-width, padding lateral de 24 px e PNGs locais com `contain`.
- Nomes ocultos antes da resposta e revelados nos três cards durante o feedback.
- Estados corret/incorrect/disabled com cor, ✓/✕/— e texto explícito.
- Feedback automático de 1800 ms; o segundo jogo preserva 1200 ms.
- Resultado, jogar novamente, trocar dificuldade, voltar aos jogos e gesto/botão nativo de voltar.
- Nenhuma API, dependência, permissão ou plugin nativo novo.

## Núcleo compartilhado

`src/shared/gameplay/flag-quiz/` passou a concentrar:

- `FlagQuizDifficulty`, `FlagQuizChoice`, `FlagQuizRound`, estado e feedback neutros;
- `DIFFICULTY_CONFIG` e a classificação editorial dos 262 IDs;
- validador de cobertura da classificação;
- gerador Fisher–Yates, distribuição e fallbacks;
- pontuação, reducer, hook configurável e efeitos sonoros;
- seletor de dificuldade, HUD, feedback, resultado e `FlagVisual`.

As duas telas continuam específicas: `guess-flag-game` renderiza bandeira → textos; `find-flag-game` renderiza nome → bandeiras. Não foi criado um componente de tela genérico baseado em render props.

Interface principal:

```ts
type FlagQuizChoice = Pick<Flag, 'id' | 'countryName' | 'visual'>;

type FlagQuizRound = {
  readonly id: string;
  readonly correctFlag: FlagQuizChoice;
  readonly intrinsicDifficulty: FlagQuizDifficulty;
  readonly options: readonly FlagQuizChoice[];
};

createFlagQuizQuestions(flags, {
  totalRounds,
  optionCount,
  difficulty,
  random,
});
```

`useFlagQuizGame` recebe opcionalmente `flags`, `totalRounds`, `optionCount` e `feedbackDurationMs`. Ele expõe estado, rodada, dificuldade, `submitAnswer`, o alias compatível `answerCurrentRound`, `selectDifficulty`, `restartGame` e `changeDifficulty`.

## Integridade visual

Os hashes dos assets mostraram imagens exatamente iguais nestes grupos:

- `cp`, `fr`, `mf`;
- `no`, `sj`.

`FLAG_VISUAL_EQUIVALENCE_GROUPS` atribui uma identidade canônica a esses IDs. O gerador não repete identidade visual entre respostas corretas da partida nem dentro das opções da rodada. As 262 entradas continuam classificadas e disponíveis em partidas diferentes. Bandeiras apenas parecidas, como Mônaco/Indonésia e Romênia/Chade, permanecem válidas.

## Acessibilidade e lifecycle

- Antes da resposta, cada card anuncia apenas “Bandeira N de 3”; o país não é exposto pelo label.
- Após o toque, as opções são bloqueadas imediatamente e passam a anunciar nome e estado.
- O feedback usa `AccessibilityInfo.announceForAccessibility` e texto que não depende somente de cor.
- A rolagem vai ao feedback e retorna ao topo na próxima rodada.
- Timer e sons possuem cleanup; deixar a partida cancela o avanço pendente.
- Voltar durante partida/resultado retorna ao seletor; voltar no seletor sai para a lista de jogos.

## Validações executadas

- [x] Documentação versionada Expo 57 consultada conforme `AGENTS.md`; SDK 54 preservado.
- [x] TypeScript estrito, ESLint completo e Prettier.
- [x] Expo Doctor: 18/18.
- [x] Bundles Hermes Android e iOS com assets e áudios locais.
- [x] Classificação 262/262, sem duplicações, ausências ou IDs desconhecidos.
- [x] 400 partidas determinísticas: 100 seeds por nível, distribuições exatas, dez respostas visualmente únicas, três opções únicas e da mesma faixa.
- [x] Pontuação, streak, erro, double tap, timer/cleanup, fallbacks e catálogo reduzido.
- [x] Emulador Android com Expo Go: seleção, acerto, erro, nomes revelados, feedback, partida completa, resultado, reinício e navegação de volta.
- [x] Quiz anterior renderizado no Android após a migração.
- [x] Bundle iOS e abertura do Expo Go no simulador.
- [ ] Fluxo da nova modalidade por toques no iOS.
- [ ] Aparelhos físicos via QR Code, TalkBack/VoiceOver e avaliação auditiva dos efeitos.

`npx expo install --check` informou dependências atualizadas usando o mapa local, mas registrou que a validação estava menos confiável por falta de rede naquele comando.

## Arquivos centrais

- `src/shared/gameplay/flag-quiz/`: núcleo compartilhado.
- `src/features/find-flag-game/screens/FindFlagGameScreen.tsx`: terceira modalidade.
- `src/features/guess-flag-game/screens/GuessFlagGameScreen.tsx`: segunda modalidade migrada.
- `src/app/navigation/AppNavigator.tsx`: registro da nova rota.
- `src/features/game-selection/data/game-options.ts`: terceiro card disponível.

## Observações para próximas sessões

- Ao trocar ou regenerar PNGs, recalcule equivalências visuais e atualize `FLAG_VISUAL_EQUIVALENCE_GROUPS` quando necessário.
- A curadoria continua voltada ao público brasileiro e deve mudar apenas com revisão editorial ou evidência de uso.
- O tipo global `Flag` não possui dificuldade; Bandeiras Giratórias continua usando o catálogo completo.
- Não afirmar validação física ou de leitores de tela até ela ser realmente executada.
