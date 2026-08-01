# Handoff da sessão — Qual é a Bandeira?

Data: 2026-08-01

> Atualização posterior: o fallback de emojis registrado nesta sessão foi resolvido com PNGs locais. Consulte `docs/handoffs/2026-08-01-local-flag-assets.md` para o estado atual.

> Atualização posterior: o motor, a dificuldade, os sons e os componentes comuns deste quiz foram extraídos para `src/shared/gameplay/flag-quiz/` ao criar “Encontre a Bandeira”. Consulte `docs/handoffs/2026-08-01-find-flag-game.md`.

## Objetivo

Implementar o segundo jogo do Flag World sem recriar o projeto, preservando Expo SDK 54, tema, navegação tipada e o primeiro jogo. A nova experiência apresenta uma bandeira e três países por dez rodadas, com pontuação, feedback visual/sonoro e resultado final.

## Resultado entregue

- Segundo item da seleção habilitado como **Qual é a Bandeira?**.
- Nova rota tipada `GuessFlagGame`.
- Feature independente `guess-flag-game`.
- Dez perguntas pré-geradas, sem repetir a bandeira correta na mesma partida.
- Três alternativas únicas, com resposta correta em posição aleatória.
- Reducer que bloqueia respostas duplicadas e centraliza as transições.
- HUD, prompt, alternativas, feedback e resultado final em componentes separados.
- Acerto, erro e conclusão com efeitos WAV diferentes.
- Reinício local da partida e retorno à seleção sem duplicar rotas.
- Estado seguro para catálogo vazio ou reduzido.
- Domínio de bandeiras movido para `shared`, permitindo uso pelos dois jogos.

## Novos arquivos

```text
src/features/guess-flag-game/
  components/
    GuessFlagFeedback/
      GuessFlagFeedback.tsx
      index.ts
    GuessFlagGameHud/
      GuessFlagGameHud.tsx
      index.ts
    GuessFlagGameResult/
      GuessFlagGameResult.tsx
      index.ts
    GuessFlagOptionButton/
      GuessFlagOptionButton.tsx
      index.ts
    GuessFlagPrompt/
      GuessFlagPrompt.tsx
      index.ts
  constants/
    guessFlagGame.constants.ts
  hooks/
    useGuessFlagGame.ts
    useGuessFlagGameSounds.ts
  screens/
    GuessFlagGameScreen.tsx
  types/
    guessFlagGame.types.ts
    index.ts
  utils/
    createGuessFlagGameQuestions.ts
    guessFlagGameRules.ts

src/shared/domain/flags/
  flags.data.ts
  index.ts
  types.ts

src/shared/assets/audio/game-effects/
  correct-answer.wav
  incorrect-answer.wav
  game-finished.wav

scripts/generate-game-effects.mjs
docs/handoffs/2026-08-01-guess-flag-game.md
```

## Arquivos existentes alterados

- `src/app/navigation/AppNavigator.tsx`: registrou a nova tela.
- `src/shared/constants/routes.ts`: adicionou `GUESS_FLAG_GAME`.
- `src/shared/types/navigation.ts`: adicionou a rota ao `RootStackParamList`.
- `src/features/game-selection/data/game-options.ts`: preservou a mudança staged que colocou o quiz em segundo lugar, corrigiu a indentação, habilitou o item e adicionou sua rota.
- `src/features/game-selection/types/index.ts`: transformou `GameOption` em união discriminada; opção disponível exige rota.
- `src/features/game-selection/screens/GameSelectionScreen.tsx`: aproveita o narrowing de disponibilidade.
- `src/features/flag-game/data/flags.data.ts`: virou adaptador local do catálogo compartilhado e manteve randomização/quantidade do primeiro jogo.
- `src/features/flag-game/types/index.ts`: manteve somente tipos de rotação.
- `src/features/flag-game/components/InteractiveFlagCard.tsx`: passou a importar `Flag` do domínio compartilhado e a renderizar corretamente o ramo visual por asset.
- `src/features/flag-game/services/randomizer.ts`: atualizou o tipo global de bandeira.
- `scripts/generate-flags-data.mjs`: agora gera `src/shared/domain/flags/flags.data.ts`.
- `src/shared/theme/index.ts`: adicionou tokens semânticos de sucesso/erro e texto sobre primário.
- `src/shared/components/AppButton/AppButton.tsx`: melhorou contraste do texto em botões primários.
- `src/features/game-selection/components/GameOptionCell.tsx` e `src/shared/components/Header/Header.tsx`: aplicaram a formatação pendente apontada pelo lint.
- `src/shared/components/AnimatedFlag/AnimatedFlag.tsx`: removeu um import não utilizado.
- `src/features/welcome/screens/WelcomeScreen.tsx`: pausa música no blur e tolera player já descartado em reload/unmount.
- `src/shared/hooks/useScreenOrientation.ts`: removeu guarda morta sem alterar o cleanup efetivo.
- `README.md`, `HANDOFF.md` e `src/shared/assets/audio/README.md`: documentação atualizada.

A alteração staged preexistente em `SplashScreen.tsx` (delay de 2200 ms para 3200 ms) foi preservada e não faz parte da implementação do quiz.

## Decisões tomadas

- Compartilhar somente o domínio neutro de bandeiras; regras de rotação continuam no primeiro jogo.
- Pré-gerar as dez rodadas ao iniciar/reiniciar para manter a partida coerente e simplificar a tela.
- Centralizar transições e métricas em reducer, mantendo `currentRound` como dado derivado.
- Isolar reprodução e tolerância a falhas no hook de áudio, sem expor players à tela.
- Manter quantidade de rodadas, opções, pontuação e duração do feedback em constantes configuráveis.
- Modelar opções da seleção como união discriminada, exigindo rota quando `isAvailable` é verdadeiro.

## Estado e transições

`useGuessFlagGame` expõe:

```ts
const { state, currentRound, answerCurrentRound, restartGame } = useGuessFlagGame();
```

O reducer armazena a lista de rodadas, índice, métricas, seleção e feedback. `currentRound` é derivada. Os status são:

- `playing`: aceita uma resposta válida.
- `showing-feedback`: bloqueia todos os novos toques e mantém o feedback por 1200 ms.
- `finished`: não mantém timer e mostra o resultado.
- `unavailable`: catálogo inválido/vazio e estado de recuperação.

O timer existe apenas dentro do hook e sempre é cancelado no cleanup. A ação `answer` verifica status e se a opção pertence à rodada, impedindo toques duplicados mesmo antes de um novo render.

## Criação das rodadas

`createGuessFlagGameQuestions`:

1. remove duplicações por ID e nome normalizado;
2. valida `totalRounds` e `optionCount`;
3. embaralha uma cópia com Fisher–Yates;
4. escolhe até dez respostas corretas diferentes;
5. cria distratores que não repetem resposta/país;
6. embaralha as alternativas de cada rodada;
7. reduz rodadas e opções quando o catálogo é pequeno;
8. retorna `[]` para entrada vazia/inválida sem acessar valores inexistentes.

A função aceita RNG opcional, permitindo execução determinística sem alterar a API usada pelo app.

## Pontuação

Constantes:

- `BASE_CORRECT_ANSWER_POINTS = 100`;
- `STREAK_BONUS_THRESHOLD = 3`;
- `STREAK_BONUS_POINTS = 25`.

O reducer calcula primeiro a nova sequência e depois chama `calculateAnswerPoints(nextStreak)`:

- sequência 1: 100;
- sequência 2: 100;
- sequência 3 ou maior: 125;
- erro: 0 e sequência zerada.

Também são mantidos acertos, erros e melhor sequência.

## Feedback e acessibilidade

- Resposta correta: opção verde, ✓, texto explícito e pontos recebidos.
- Resposta incorreta: opção selecionada vermelha, ✕ e revelação da opção correta em verde.
- Demais opções ficam desabilitadas.
- O prompt muda a borda/surface e o feedback entra com animação curta.
- As opções possuem role button, estado disabled/selected, labels e altura mínima.
- O emoji do prompt não anuncia o país ao leitor de tela antes da resposta.
- O prompt respeita ambos os ramos de `FlagVisual`: emoji e asset.
- O feedback textual possui live region e não depende somente da cor.

## Áudio

`scripts/generate-game-effects.mjs` cria WAVs PCM mono, 16-bit e 22.050 Hz:

- acerto: 0,45 s, notas ascendentes;
- erro: 0,50 s, notas descendentes;
- final: 1,10 s, sequência comemorativa.

`useGuessFlagGameSounds` chama `useAudioPlayer` três vezes de forma estática. Antes de tocar:

1. invalida a solicitação anterior;
2. pausa os três players;
3. executa `seekTo(0)`;
4. confirma que a solicitação ainda é atual e que o hook está montado;
5. executa `play()`.

IDs de feedback e `gameId` impedem repetição por rerender. Falhas são tratadas silenciosamente. A música da Welcome agora pausa no blur para não competir com os efeitos.

## Integração da rota

- Constante: `ROUTES.GUESS_FLAG_GAME`.
- Param list: `[ROUTES.GUESS_FLAG_GAME]: undefined`.
- Navigator: uma única `Stack.Screen` com `GuessFlagGameScreen`.
- Seleção: segundo item disponível com a rota no próprio dado.
- Voltar: `navigation.goBack()`.
- Reinício: reducer local, sem `push`, `navigate` ou nova instância da tela.

## Validações executadas

- `npx tsc --noEmit`: passou.
- ESLint completo: passou com zero erros e zero warnings de código; permanece apenas o aviso de depreciação do `.eslintrc` no ESLint 9.
- Expo Doctor: 18/18.
- Bundles Hermes Android/iOS: HTTP 200.
- Catálogo compartilhado: 262 IDs únicos.
- Arquivos de áudio reconhecidos como WAV PCM válidos.
- Gerador executado com RNG determinístico:
  - dez rodadas;
  - dez corretas únicas;
  - três alternativas únicas;
  - resposta correta sempre presente;
  - catálogo original não mutado;
  - redução segura para duas/zero bandeiras.
- Reducer compilado e executado fora da UI:
  - erro inicial;
  - segundo toque ignorado;
  - nove acertos seguintes;
  - pontuação final 1075;
  - bônus `[100, 100, 125]`;
  - `finished` após a décima rodada;
  - restart zerando métricas.
- Expo Go foi instalado/aberto no simulador iPhone 17 Pro (iOS 26.3).
- A tela inicial do quiz renderizou HUD 1/10, prompt e três opções.
- Um reload real expôs uma exceção ao pausar o tema da Welcome após descarte do player; o lifecycle foi corrigido e o reload seguinte não repetiu o erro.

## O que não foi possível validar

- Não havia aparelho/emulador Android conectado ao ADB.
- O ambiente não permitiu injetar toques no Simulator, então não houve percurso manual completo Welcome → Selection → quiz → resultado → restart → voltar.
- Os três sons foram gerados, carregados pelo bundle e seus players foram montados sem exceção, mas sua qualidade/volume não pôde ser confirmada por audição humana nesta sessão.
- Não afirmar teste manual ponta a ponta até alguém percorrer esse fluxo em um aparelho físico.

## Problemas e limitações conhecidos

- A fonte do simulador iOS 26.3 exibiu glifos de fallback para emojis, inclusive na Welcome; isso é uma limitação do runtime/fonte do simulador observado, não do catálogo.
- O `lockAsync(PORTRAIT)` avisou que a orientação era “não suportada” nesse simulador, mas a exceção foi absorvida e o app permaneceu visualmente em portrait pelo `app.json`.
- O quiz ainda não possui persistência, dificuldade ou cronômetro.
- A definição não utilizada em `src/app/routes/` continua no repositório; a fonte canônica permanece `src/shared/constants/routes.ts`.

## Sugestões para a próxima sessão

1. Percorrer manualmente o fluxo completo em Android e iOS físicos.
2. Conferir distinção e volume de acerto, erro e final.
3. Confirmar as bandeiras por tag e Sark em sistemas mais antigos.
4. Se adicionar dificuldade, parametrizar rounds/opções sem alterar a tela.
5. Se adicionar ranking, manter persistência fora do reducer e da tela.
