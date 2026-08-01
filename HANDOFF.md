# Handoff — Flag World

Atualizado em: 2026-08-01

## Objetivo deste documento

Este é o estado consolidado do projeto. Continue a partir da arquitetura existente, preserve a compatibilidade com Expo Go 54 e consulte também os handoffs incrementais em [docs/handoffs](docs/handoffs) antes de alterar uma feature relevante.

## Stack e compatibilidade

- React Native + Expo + TypeScript com tipagem estrita.
- Expo SDK 54 (`expo ~54.0.36`).
- React Native 0.81.5 e React 19.1.
- TypeScript 5.9.
- `expo-audio` 1.1.1 para música e efeitos locais.
- React Navigation 7 com native stack tipada.
- Reanimated 4 para animações leves.
- A linha do SDK 54 foi mantida para abrir no Expo Go 54 de aparelhos físicos Android e iOS por QR Code.

## Fluxo de navegação atual

```text
Splash
  ↓ replace
Welcome
  ├── Information
  └── Game Selection
        ├── Bandeiras Giratórias → Flag Game
        └── Qual é a Bandeira?  → Guess Flag Game
```

- `Welcome → Game Selection` usa `navigate`, preservando a tela anterior.
- A seleção navega pela rota armazenada nos dados do item, sem comparação por índice.
- Ambos os jogos usam `navigation.goBack()` para retornar à seleção.
- Jogar novamente no quiz reinicia o reducer local; não empilha uma segunda tela.
- A fonte canônica das rotas é [src/shared/constants/routes.ts](src/shared/constants/routes.ts). O diretório legado `src/app/routes/` não possui consumidores e não deve virar uma segunda fonte de verdade.

## Estado confirmado do aplicativo

- Welcome com tema musical local, controlado pelo botão Música/Silencioso.
- A música é pausada quando Welcome perde o foco, evitando sobreposição com os efeitos dos jogos.
- Information, Game Selection, Flag Game e Guess Flag Game usam 32 px de padding horizontal.
- Game Selection possui dez opções: duas disponíveis e oito marcadas como “Em breve”.
- Game Selection e os dois jogos solicitam orientação `PORTRAIT` pelo hook compartilhado.
- Catálogo compartilhado com 262 bandeiras RGI do Unicode Emoji 17.0, renderizadas por PNGs locais do Twemoji.
- O aplicativo não depende mais da fonte de emojis do sistema para mostrar bandeiras.
- O domínio global `Flag`, `FlagVisual` e `FLAG_OPTIONS` fica em `src/shared/domain/flags/`.

## Jogo 1 — Bandeiras Giratórias

- Mostra 30 bandeiras aleatórias por rodada em `ScrollView`.
- Grade de três colunas, usando `width: '31%'` para evitar quebra por arredondamento do Yoga.
- Cada bandeira aceita quatro toques, acumulando 90° por toque até completar 360°.
- Após o quarto toque, o card fica desabilitado, muda para aparência indisponível e deixa de atualizar o estado.
- Resetar limpa os giros; Sortear novamente escolhe outras 30 bandeiras.
- Regras de rotação, estado e randomização continuam exclusivas da feature `flag-game`.

## Jogo 2 — Qual é a Bandeira?

- Feature independente em `src/features/guess-flag-game/`.
- Dez rodadas por partida e três alternativas por rodada.
- As dez bandeiras corretas são diferentes dentro da mesma partida.
- Alternativas não repetem ID/nome, incluem exatamente uma correta e têm posição embaralhada.
- Catálogos reduzidos diminuem com segurança a quantidade de rodadas/opções; catálogo vazio mostra estado amigável.
- A geração usa Fisher–Yates imutável e aceita uma fonte aleatória opcional para validação determinística futura.

### Estado e transições

O hook `useGuessFlagGame` possui um reducer coeso com:

- `rounds`, índice atual e `gameId`;
- score, acertos, erros, sequência e melhor sequência;
- opção selecionada e feedback atual;
- status `playing`, `showing-feedback`, `finished` ou `unavailable`.

Fluxo:

```text
playing
  ↓ primeira resposta válida
showing-feedback
  ↓ 1200 ms (timer com cleanup)
playing na próxima rodada
  ↓ última rodada
finished
```

- O reducer ignora respostas quando não está em `playing`, inclusive dois despachos rápidos no mesmo batch.
- A tela não cria perguntas, não calcula pontuação e não controla timers.
- `currentRound` é derivada de `rounds[currentRoundIndex]`, evitando estado duplicado.

### Pontuação

- Acerto: 100 pontos.
- Primeiro e segundo acertos consecutivos: 100 pontos cada.
- Terceiro acerto consecutivo e seguintes: 125 pontos (100 + bônus de 25).
- Erro: zero ponto e sequência volta para zero.
- O resultado mostra pontos, acertos, erros, melhor sequência e mensagem de desempenho.

### Interface e acessibilidade

- HUD compacto com rodada, score, acertos e sequência.
- Prompt local com entrada suave; não reutiliza a animação infinita do primeiro jogo.
- A abstração visual renderiza emoji ou asset real nos dois jogos; o catálogo atual usa assets locais para evitar glifos `?` em runtimes sem suporte adequado.
- Opções possuem estados puros `idle`, `correct`, `incorrect` e `disabled`.
- Acerto usa verde + ✓ + texto; erro usa vermelho + ✕ + texto, sem depender só de cor.
- O leitor de tela não recebe o nome da bandeira antes da resposta, pois isso entregaria a solução.
- Falha na lista mostra “Não foi possível carregar as bandeiras.” e Tentar novamente.

### Áudio

- Três WAVs originais em `src/shared/assets/audio/game-effects/`:
  - `correct-answer.wav`;
  - `incorrect-answer.wav`;
  - `game-finished.wav`.
- `useGuessFlagGameSounds` possui três players estáticos de `expo-audio`.
- Cada reprodução pausa os demais players, volta ao início e usa proteção contra corridas/unmount.
- Falhas de áudio são absorvidas e nunca interrompem o jogo.
- `useAudioPlayer` libera os recursos ao desmontar; não chamar `remove()` manualmente nesses players.

## Estrutura principal

```text
src/
  app/navigation/
  features/
    flag-game/
    game-selection/
    guess-flag-game/
      components/
      constants/
      hooks/
      screens/
      types/
      utils/
  shared/
    assets/audio/
    components/
    domain/flags/
    hooks/
    theme/
    types/
docs/handoffs/
scripts/
```

## Arquivos importantes

- [src/app/navigation/AppNavigator.tsx](src/app/navigation/AppNavigator.tsx): pilha e registro das telas.
- [src/shared/constants/routes.ts](src/shared/constants/routes.ts): constantes canônicas de rota.
- [src/shared/types/navigation.ts](src/shared/types/navigation.ts): `RootStackParamList`.
- [src/features/game-selection/data/game-options.ts](src/features/game-selection/data/game-options.ts): opções e disponibilidade dos jogos.
- [src/shared/domain/flags/flags.data.ts](src/shared/domain/flags/flags.data.ts): catálogo compartilhado de 262 bandeiras.
- [src/shared/domain/flags/flags.assets.ts](src/shared/domain/flags/flags.assets.ts): mapa estático entre IDs e PNGs reconhecido pelo Metro.
- [src/shared/assets/flags](src/shared/assets/flags): 262 imagens locais e atribuição do Twemoji.
- [src/shared/domain/flags/types.ts](src/shared/domain/flags/types.ts): domínio neutro, sem dependência de React Native.
- [src/features/flag-game/screens/FlagGameScreen.tsx](src/features/flag-game/screens/FlagGameScreen.tsx): primeiro jogo.
- [src/features/guess-flag-game/screens/GuessFlagGameScreen.tsx](src/features/guess-flag-game/screens/GuessFlagGameScreen.tsx): composição da tela do quiz.
- [src/features/guess-flag-game/hooks/useGuessFlagGame.ts](src/features/guess-flag-game/hooks/useGuessFlagGame.ts): reducer e lifecycle da partida.
- [src/features/guess-flag-game/hooks/useGuessFlagGameSounds.ts](src/features/guess-flag-game/hooks/useGuessFlagGameSounds.ts): efeitos sem expor players à tela.
- [src/features/guess-flag-game/utils/createGuessFlagGameQuestions.ts](src/features/guess-flag-game/utils/createGuessFlagGameQuestions.ts): geração pura das perguntas.
- [scripts/generate-flags-data.mjs](scripts/generate-flags-data.mjs): regenera o catálogo compartilhado.
- [scripts/download-flag-assets.mjs](scripts/download-flag-assets.mjs): baixa/valida os PNGs e regenera o mapa estático.
- [scripts/generate-welcome-theme.mjs](scripts/generate-welcome-theme.mjs): regenera o tema da Welcome.
- [scripts/generate-game-effects.mjs](scripts/generate-game-effects.mjs): regenera os três efeitos do quiz.
- [docs/handoffs/2026-08-01-guess-flag-game.md](docs/handoffs/2026-08-01-guess-flag-game.md): detalhes da sessão do segundo jogo.
- [docs/handoffs/2026-08-01-local-flag-assets.md](docs/handoffs/2026-08-01-local-flag-assets.md): migração de emojis para imagens locais.

## Decisões arquiteturais

- Compartilhar apenas o domínio real de bandeiras; não mover rotação ou componentes do primeiro jogo para `shared`.
- Manter as regras do quiz independentes de React Native e da feature `flag-game`.
- Usar reducer em vez de vários `useState` desconectados.
- Gerar toda a partida uma única vez ao iniciar/reiniciar.
- Usar valores configuráveis para quantidade de rodadas, opções, pontos e duração do feedback.
- Usar união discriminada em `GameOption`: item disponível exige rota em compile-time.
- Não adicionar biblioteca de testes, áudio remoto, `expo-av`, permissão ou plugin nativo.

## Validações da sessão de 2026-08-01

- `npx tsc --noEmit`: passou.
- ESLint completo: zero erros e zero warnings de código; permanece apenas o aviso de depreciação da configuração `.eslintrc` no ESLint 9.
- `npx expo-doctor@latest`: 18/18 verificações passaram.
- Bundles Hermes Android e iOS: HTTP 200.
- Catálogo: 262 IDs únicos confirmados.
- Assets: 262 PNGs válidos e mapeados estaticamente; Welcome e quiz renderizaram bandeiras reais no simulador sem glifos `?`.
- WAVs: três arquivos PCM mono, 16-bit, 22.050 Hz válidos.
- Geração determinística: dez corretas únicas, três alternativas únicas, catálogo não mutado e redução segura para catálogo pequeno.
- Simulação do reducer: erro, bloqueio de segunda resposta, 10 rodadas, bônus 100/100/125, finalização, score, melhor sequência e restart validados.
- Expo Go abriu a nova tela em um iPhone 17 Pro simulado com iOS 26.3; HUD, prompt e três opções renderizaram.
- Um reload real encontrou e permitiu corrigir a pausa de um player já liberado durante Fast Refresh.
- Antes desta sessão, o fluxo Welcome → Game Selection → voltar e Game Selection → Bandeiras Giratórias já havia sido percorrido manualmente em emulador Android, incluindo orientação e rolagem.

Não foi possível percorrer o fluxo inteiro por toques no simulador: não havia Android conectado e o ambiente não disponibilizou automação de entrada no Simulator. Portanto, acerto/erro/resultado foram validados na lógica executável, mas não devem ser descritos como teste manual ponta a ponta da interface.

## Limitações e observações conhecidas

- Os gráficos de bandeira são do Twemoji e usam licença CC BY 4.0; preserve a atribuição no README ao redistribuí-los.
- `lockAsync(PORTRAIT)` emitiu aviso de orientação não suportada nesse simulador específico; a exceção foi tratada e `app.json` continua fixado em portrait.
- `adb shell monkey -p <pkg> -c android.intent.category.LAUNCHER 1` injeta um toque aleatório além de abrir o app; para um relaunch previsível, prefira `force-stop` seguido de `adb shell am start -n <pkg>/<activity>`.
- Reabrir por deep link pode restaurar a última tela e remontar telas anteriores, provocando disputa entre locks de orientação. Para validar orientação, navegue manualmente a partir de estado limpo.
- O quiz ainda não possui cronômetro, dificuldade, persistência de score ou ranking.
- O randomizador legado do primeiro jogo ainda usa `sort` aleatório; o quiz já usa Fisher–Yates.
- `src/app/routes/` é legado e não utilizado. Evite importar dele.

## Regras para próximas sessões

- Leia `AGENTS.md`, este handoff e o handoff específico mais recente antes de alterar código.
- Preserve Expo SDK 54 enquanto a meta for Expo Go 54 em aparelhos físicos.
- Use aliases `@/`, tipagem estrita e componentes/regras na feature correta.
- Toda sessão que alterar comportamento, navegação, arquitetura ou feature relevante deve criar/atualizar um arquivo em `docs/handoffs/`.
- Execute no mínimo TypeScript e uma validação de bundle antes de afirmar que está pronto.
- Não afirme validação manual que não aconteceu.

## Comandos úteis

```bash
npm install
npx tsc --noEmit
ESLINT_USE_FLAT_CONFIG=false npx eslint "src/**/*.{ts,tsx}" "scripts/*.mjs"
npx expo-doctor@latest
npx expo start --clear
node scripts/generate-welcome-theme.mjs
node scripts/generate-game-effects.mjs
node scripts/download-flag-assets.mjs
```

## Próximas prioridades recomendadas

1. Fazer teste manual completo do quiz em aparelho físico: um acerto, um erro, dez rodadas, reinício e voltar.
2. Confirmar volume e distinção dos três efeitos em Android e iOS físicos.
3. Adicionar dificuldade ou cronômetro apenas mantendo o reducer configurável.
4. Considerar persistência de melhor pontuação sem acoplar storage à tela.
5. Remover a definição legada `src/app/routes/` em uma limpeza dedicada, após confirmar que nenhum consumidor externo depende dela.
