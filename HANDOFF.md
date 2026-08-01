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
        ├── Qual é a Bandeira?  → Seleção de dificuldade → Guess Flag Game → Resultado
        └── Encontre a Bandeira → Seleção de dificuldade → Find Flag Game  → Resultado
```

- `Welcome → Game Selection` usa `navigate`, preservando a tela anterior.
- A seleção navega pela rota armazenada nos dados do item, sem comparação por índice.
- Bandeiras Giratórias usa `navigation.goBack()` para retornar à seleção de jogos.
- Nos quizzes, voltar durante uma partida ou no resultado abandona a partida e retorna ao seletor de dificuldade; voltar a partir do seletor retorna à seleção de jogos. O bloqueio do gesto/botão nativo segue a mesma regra por `usePreventRemove`.
- Jogar novamente reinicia o reducer compartilhado no mesmo nível; não empilha uma segunda tela.
- A fonte canônica das rotas é [src/shared/constants/routes.ts](src/shared/constants/routes.ts). O diretório legado `src/app/routes/` não possui consumidores e não deve virar uma segunda fonte de verdade.

## Estado confirmado do aplicativo

- Welcome com tema musical local, controlado pelo botão Música/Silencioso.
- A música é pausada quando Welcome perde o foco, evitando sobreposição com os efeitos dos jogos.
- Information, Game Selection, Flag Game e Guess Flag Game usam 32 px de padding horizontal; Find Flag Game usa 24 px.
- Game Selection possui dez opções: três disponíveis e sete marcadas como “Em breve”.
- Game Selection e os três jogos solicitam orientação `PORTRAIT` pelo hook compartilhado.
- Catálogo compartilhado com 262 bandeiras RGI do Unicode Emoji 17.0, renderizadas por PNGs locais do Twemoji.
- Os dois quizzes compartilham quatro dificuldades editoriais e classificam as 262 bandeiras exatamente uma vez: 43 fáceis, 90 médias, 70 difíceis e 59 especialistas.
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

- Tela e componentes específicos em `src/features/guess-flag-game/`, consumindo o núcleo neutro `src/shared/gameplay/flag-quiz/`.
- A entrada da rota mostra primeiro quatro cards acessíveis: Fácil, Médio, Difícil e Especialista.
- Dez rodadas por partida e três alternativas por rodada.
- As dez bandeiras corretas possuem IDs e identidades visuais diferentes dentro da mesma partida.
- Alternativas não repetem ID, nome ou identidade visual, incluem exatamente uma correta e têm posição embaralhada.
- A geração usa Fisher–Yates imutável e aceita uma fonte aleatória opcional para validação determinística.

### Classificação editorial

`FlagQuizDifficulty` possui os valores `easy`, `medium`, `hard` e `expert`. A curadoria está no núcleo compartilhado dos quizzes, porque familiaridade é uma regra subjetiva de gameplay, não uma propriedade global de `Flag`.

| Nível        | Quantidade | Critério                                         | Exemplos                      |
| ------------ | ---------: | ------------------------------------------------ | ----------------------------- |
| Fácil        |         43 | Bandeiras muito presentes no Brasil e no mundo   | Brasil, Estados Unidos, Japão |
| Médio        |         90 | Bandeiras vistas em esportes, notícias e viagens | Camarões, Catar, Tailândia    |
| Difícil      |         70 | Países soberanos de menor exposição              | Jordânia, Benin, Quirguistão  |
| Especialista |         59 | Prioriza territórios, dependências e ilhas raras | Pitcairn, Tokelau, Clipperton |

- Cada um dos 262 IDs aparece exatamente uma vez.
- O validador puro informa duplicações, IDs desconhecidos e IDs não classificados; em desenvolvimento, o módulo do hook executa a asserção contra `FLAG_OPTIONS` ao ser carregado.
- `FLAG_VISUAL_EQUIVALENCE_GROUPS` registra os assets comprovadamente idênticos: `cp/fr/mf` e `no/sj`. Essas identidades não se repetem nas alternativas ou respostas corretas de uma partida.
- Mudanças no catálogo compartilhado exigem atualização explícita da curadoria. Não existe API ou consulta de rede em runtime.

### Distribuição acumulada e alternativas

| Nível escolhido | Distribuição das 10 respostas corretas           |
| --------------- | ------------------------------------------------ |
| Fácil           | 10 fáceis                                        |
| Médio           | 7 médias + 3 fáceis                              |
| Difícil         | 6 difíceis + 3 médias + 1 fácil                  |
| Especialista    | 5 especialistas + 3 difíceis + 1 média + 1 fácil |

- A dificuldade escolhida define a composição e o multiplicador de toda a partida; cada rodada também conserva sua `intrinsicDifficulty`.
- Os dois distratores pertencem à classificação intrínseca da resposta correta em toda rodada emitida.
- Se uma faixa estiver incompleta em um catálogo reduzido, respostas não elegíveis saem do pool e a quota usa níveis inferiores já liberados. Se não houver três opções únicas na mesma faixa, a quantidade de rodadas é reduzida com segurança; catálogo vazio mostra estado amigável.
- A distribuição é escalada proporcionalmente quando `totalRounds` difere de dez e permanece centralizada em `DIFFICULTY_CONFIG`.

### Estado e transições

O hook `useFlagQuizGame` possui um reducer coeso com:

- `rounds`, índice atual e `gameId`;
- score, acertos, erros, sequência e melhor sequência;
- dificuldade escolhida;
- opção selecionada e feedback atual;
- status `selecting-difficulty`, `playing`, `showing-feedback`, `finished` ou `unavailable`.

Fluxo:

```text
selecting-difficulty
  ↓ escolher um nível válido
playing
  ↓ primeira resposta válida
showing-feedback
  ↓ duração configurável (1200 ms neste jogo; timer com cleanup)
playing na próxima rodada
  ↓ última rodada
finished
  ├── jogar novamente → playing no mesmo nível
  ├── trocar dificuldade → selecting-difficulty
  └── voltar aos jogos → Game Selection
```

- O reducer ignora respostas quando não está em `playing`, inclusive dois despachos rápidos no mesmo batch.
- A tela não cria perguntas, não calcula pontuação e não controla timers.
- `currentRound` é derivada de `rounds[currentRoundIndex]`, evitando estado duplicado.
- `selectDifficulty`, `restartGame` e `changeDifficulty` regeneram ou limpam o estado sem empilhar rotas.

### Pontuação

O reducer calcula `Math.round((100 + bônus) × multiplicador)`. O bônus é zero no primeiro e segundo acertos consecutivos e 25 a partir do terceiro:

| Nível da partida | Multiplicador | Acerto normal | Com bônus |
| ---------------- | ------------: | ------------: | --------: |
| Fácil            |            ×1 |           100 |       125 |
| Médio            |          ×1,2 |           120 |       150 |
| Difícil          |          ×1,6 |           160 |       200 |
| Especialista     |            ×2 |           200 |       250 |

- O multiplicador é o nível selecionado para a partida, inclusive nas rodadas acumuladas provenientes de faixas inferiores.
- Erro vale zero e reinicia a sequência.
- HUD, feedback e resultado mostram dificuldade e multiplicador; o resultado também mostra pontos, acertos, erros, melhor sequência e mensagem de desempenho.

### Interface e acessibilidade

- O seletor usa quatro cards em coluna com descrição, exemplos, multiplicador, feedback de toque e rótulo completo para leitor de tela.
- HUD compacto com dificuldade, multiplicador, rodada, score, acertos e sequência.
- Prompt local com entrada suave; não reutiliza a animação infinita do primeiro jogo.
- `FlagVisual` renderiza emoji ou asset real nos dois quizzes; o catálogo atual usa assets locais para evitar glifos `?` em runtimes sem suporte adequado.
- Opções possuem estados puros `idle`, `correct`, `incorrect` e `disabled`.
- Acerto usa verde + ✓ + texto; erro usa vermelho + ✕ + texto, sem depender só de cor.
- O leitor de tela não recebe o nome da bandeira antes da resposta, pois isso entregaria a solução.
- Ao responder, a tela rola o feedback para a área visível e usa `AccessibilityInfo.announceForAccessibility`; a rodada seguinte volta ao início do conteúdo.
- Falha na lista mostra “Não foi possível carregar as bandeiras.”, Tentar novamente e Trocar dificuldade.
- No resultado, Jogar novamente preserva o nível; Trocar dificuldade limpa a partida; Voltar aos jogos sai da rota.

### Áudio

- Três WAVs originais em `src/shared/assets/audio/game-effects/`:
  - `correct-answer.wav`;
  - `incorrect-answer.wav`;
  - `game-finished.wav`.
- `useFlagQuizGameSounds` possui três players estáticos de `expo-audio` compartilhados pelas duas modalidades.
- Cada reprodução pausa os demais players, volta ao início e usa proteção contra corridas/unmount.
- Falhas de áudio são absorvidas e nunca interrompem o jogo.
- `useAudioPlayer` libera os recursos ao desmontar; não chamar `remove()` manualmente nesses players.

## Jogo 3 — Encontre a Bandeira

- Feature específica em `src/features/find-flag-game/` e rota tipada `FindFlagGame`.
- Usa o mesmo seletor, classificação, gerador, pontuação, reducer, HUD, feedback, resultado e sons do segundo jogo.
- Cada rodada mostra “Escolha a bandeira correta”, o nome da entidade em destaque e três cards de bandeira empilhados com padding lateral de 24 px.
- Antes da resposta, os cards não expõem o nome pelo texto nem pelo leitor de tela; o label acessível identifica apenas a posição da opção.
- Após a resposta, os três nomes são revelados, a correta fica verde com ✓, a selecionada incorreta fica vermelha com ✕ e as demais ficam desabilitadas com texto explícito.
- O feedback permanece por 1800 ms para permitir a leitura das bandeiras e nomes; a tela rola até ele e volta ao topo na rodada seguinte.
- Prompt e cards são específicos desta modalidade; não existe uma tela única com render props para os dois sentidos do quiz.

## Estrutura principal

```text
src/
  app/navigation/
  features/
    flag-game/
    find-flag-game/
      components/
      screens/
    game-selection/
    guess-flag-game/
      components/
      screens/
  shared/
    assets/audio/
    components/
    domain/flags/
    gameplay/flag-quiz/
      components/
      constants/
      data/
      hooks/
      types/
      utils/
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
- [src/features/guess-flag-game/screens/GuessFlagGameScreen.tsx](src/features/guess-flag-game/screens/GuessFlagGameScreen.tsx): composição específica do quiz bandeira → nome.
- [src/features/find-flag-game/screens/FindFlagGameScreen.tsx](src/features/find-flag-game/screens/FindFlagGameScreen.tsx): composição específica do quiz nome → bandeira.
- [src/shared/gameplay/flag-quiz/index.ts](src/shared/gameplay/flag-quiz/index.ts): API pública do núcleo compartilhado.
- [src/shared/gameplay/flag-quiz/data/flag-difficulty.data.ts](src/shared/gameplay/flag-quiz/data/flag-difficulty.data.ts): curadoria explícita dos 262 IDs.
- [src/shared/gameplay/flag-quiz/hooks/useFlagQuizGame.ts](src/shared/gameplay/flag-quiz/hooks/useFlagQuizGame.ts): reducer, geração e lifecycle configurável da partida.
- [src/shared/gameplay/flag-quiz/utils/createFlagQuizQuestions.ts](src/shared/gameplay/flag-quiz/utils/createFlagQuizQuestions.ts): geração pura, distribuição e identidade visual.
- [src/shared/gameplay/flag-quiz/utils/validateFlagDifficultyClassification.ts](src/shared/gameplay/flag-quiz/utils/validateFlagDifficultyClassification.ts): cobertura, duplicações e integridade da curadoria.
- [scripts/generate-flags-data.mjs](scripts/generate-flags-data.mjs): regenera o catálogo compartilhado.
- [scripts/download-flag-assets.mjs](scripts/download-flag-assets.mjs): baixa/valida os PNGs e regenera o mapa estático.
- [scripts/generate-welcome-theme.mjs](scripts/generate-welcome-theme.mjs): regenera o tema da Welcome.
- [scripts/generate-game-effects.mjs](scripts/generate-game-effects.mjs): regenera os três efeitos do quiz.
- [docs/handoffs/2026-08-01-guess-flag-game.md](docs/handoffs/2026-08-01-guess-flag-game.md): detalhes da sessão do segundo jogo.
- [docs/handoffs/2026-08-01-local-flag-assets.md](docs/handoffs/2026-08-01-local-flag-assets.md): migração de emojis para imagens locais.
- [docs/handoffs/2026-08-01-guess-flag-difficulty.md](docs/handoffs/2026-08-01-guess-flag-difficulty.md): implementação das quatro dificuldades.
- [docs/handoffs/2026-08-01-find-flag-game.md](docs/handoffs/2026-08-01-find-flag-game.md): terceira modalidade e extração do núcleo compartilhado.

## Decisões arquiteturais

- Compartilhar o domínio real de bandeiras e o núcleo dos dois quizzes; rotação e componentes do primeiro jogo permanecem exclusivos de `flag-game`.
- Manter as regras puras dos quizzes independentes de React Native e da feature `flag-game`.
- Manter dificuldade dentro de `shared/gameplay/flag-quiz` e não adicionar esse campo ao domínio global `Flag`.
- Usar uma classificação editorial, explícita e revisável para o público brasileiro em vez de derivação por população ou API externa.
- Usar reducer em vez de vários `useState` desconectados.
- Gerar toda a partida uma única vez ao iniciar/reiniciar.
- Centralizar labels, exemplos, multiplicadores e distribuições em `DIFFICULTY_CONFIG`, além dos valores configuráveis de rodadas, opções, pontos e duração do feedback.
- Usar união discriminada em `GameOption`: item disponível exige rota em compile-time.
- Não adicionar biblioteca de testes, áudio remoto, `expo-av`, permissão ou plugin nativo.

## Validações anteriores da sessão de 2026-08-01

Os resultados abaixo foram confirmados antes da adição das dificuldades e permanecem como histórico; eles não substituem a nova rodada de validação desta etapa.

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

### Validações da etapa de dificuldades

- [x] Classificação: 262/262 IDs, distribuição 43/90/70/59, sem duplicados, desconhecidos ou ausentes.
- [x] Gerador determinístico: 80 partidas confirmaram Fácil 10/0/0/0, Médio 3/7/0/0, Difícil 1/3/6/0 e Especialista 1/1/3/5.
- [x] Gerador: dez corretas únicas, três opções únicas, resposta presente, distratores da faixa intrínseca e catálogo imutável.
- [x] Fallbacks: catálogo vazio/reduzido, faixa incompleta, total/opções inválidos e dificuldade inválida sem crash; toda rodada emitida preservou as três opções na mesma faixa.
- [x] Pontuação: 100/125, 120/150, 160/200 e 200/250; erro zerou a sequência e rodadas fáceis dentro de um modo difícil usaram o multiplicador do modo.
- [x] Reducer: seleção, bloqueio da segunda resposta, avanço, finalização, reinício no mesmo nível, troca e estado indisponível.
- [x] `npx tsc --noEmit --incremental false`.
- [x] ESLint completo sem erros ou warnings de código; apenas o aviso de depreciação do `.eslintrc` no ESLint 9.
- [x] `npx expo install --check`: dependências atualizadas.
- [x] `npx expo-doctor@latest`: 18/18 verificações.
- [x] Bundles Hermes Android e iOS por `npx expo export`.
- [x] Fluxo no Expo Go do emulador Android: quatro cards, Fácil/Especialista, bandeiras locais, acerto, erro, duas partidas completas, resultado, reinício, troca, saída e botão nativo Voltar.
- [ ] Aparelho físico: não havia hardware conectado; validar QR Code, áudio, gestos e layout em Android/iOS reais.

### Validações da etapa “Encontre a Bandeira”

- [x] A referência versionada do Expo 57 exigida por `AGENTS.md` foi consultada antes das alterações; o projeto permaneceu no SDK 54/React Native 0.81.
- [x] Classificação compartilhada: 262/262 IDs, contagens 43/90/70/59, sem duplicados, desconhecidos ou ausentes.
- [x] Harness independente: 400 partidas, 100 seeds por nível, confirmaram as quatro distribuições, dez respostas com identidade visual única, três opções da mesma faixa e resposta correta presente.
- [x] Hashes dos 262 PNGs confirmaram somente duas famílias exatamente equivalentes: `cp/fr/mf` e `no/sj`; ambas são bloqueadas pelo gerador.
- [x] Pontuação, bônus, reset de sequência, bloqueio de toque duplo, reducer, timer/cleanup e catálogo reduzido foram revalidados.
- [x] `npx tsc --noEmit --incremental false`, ESLint completo e Prettier passaram; o lint manteve apenas o aviso de depreciação da configuração legada.
- [x] `npx expo-doctor@latest`: 18/18 verificações passaram com acesso à rede.
- [x] `npx expo install --check` usou o mapa local e informou dependências atualizadas, mas avisou que a checagem era menos confiável por estar offline.
- [x] Bundles Hermes Android e iOS por `npx expo export` concluíram, incluindo os 262 PNGs e os efeitos locais.
- [x] Expo Go no emulador Android: terceiro card, seletor completo, partida Fácil, três cards com assets reais, acerto, erro, bloqueio visual, nomes revelados, feedback de 1800 ms, auto-scroll, dez rodadas, resultado, reinício e retorno em duas etapas.
- [x] Regressão do segundo jogo no Android: seletor, HUD, prompt com PNG e três opções textuais continuaram renderizando normalmente após a migração.
- [x] O Expo Go abriu no simulador iOS e o bundle iOS foi gerado, mas o fluxo da terceira modalidade não foi percorrido por toques nesse simulador.
- [ ] TalkBack, VoiceOver, qualidade/volume dos sons e aparelho físico por QR Code continuam pendentes.

## Limitações e observações conhecidas

- Os gráficos de bandeira são do Twemoji e usam licença CC BY 4.0; preserve a atribuição no README ao redistribuí-los.
- `lockAsync(PORTRAIT)` emitiu aviso de orientação não suportada nesse simulador específico; a exceção foi tratada e `app.json` continua fixado em portrait.
- `adb shell monkey -p <pkg> -c android.intent.category.LAUNCHER 1` injeta um toque aleatório além de abrir o app; para um relaunch previsível, prefira `force-stop` seguido de `adb shell am start -n <pkg>/<activity>`.
- Reabrir por deep link pode restaurar a última tela e remontar telas anteriores, provocando disputa entre locks de orientação. Para validar orientação, navegue manualmente a partir de estado limpo.
- A dificuldade é uma estimativa editorial de familiaridade para o público brasileiro; ela pode precisar de ajustes com feedback real de jogadores.
- Os quizzes ainda não possuem cronômetro, persistência de score ou ranking.
- A terceira modalidade passou nas validações automatizadas, bundles e fluxo completo no emulador Android; falta repetir a checagem em aparelho físico e percorrer sua UI no iOS.
- O randomizador legado do primeiro jogo ainda usa `sort` aleatório; os quizzes usam Fisher–Yates.
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

1. Fazer teste manual em aparelho físico: percorrer os dois quizzes por QR Code, incluindo todos os níveis, reinício, troca de dificuldade e voltar.
2. Confirmar volume, distinção dos três efeitos, VoiceOver e TalkBack em Android/iOS físicos.
3. Coletar feedback de jogadores brasileiros e revisar a curadoria editorial quando houver evidência.
4. Considerar persistência de melhor pontuação por dificuldade sem acoplar storage à tela.
5. Remover a definição legada `src/app/routes/` em uma limpeza dedicada, após confirmar que nenhum consumidor externo depende dela.
