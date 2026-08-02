# Flag World

Flag World é um jogo mobile em React Native + Expo criado para explorar bandeiras, países e interações leves em uma primeira versão funcional.

## Jogos disponíveis

- **Bandeiras Giratórias:** toque em cada bandeira até quatro vezes; ao esgotar os giros, o card fica indisponível.
- **Qual é a Bandeira?:** escolha uma dificuldade e identifique o país correto entre três alternativas em uma partida de dez rodadas, com pontuação, bônus de sequência, feedback visual/sonoro e resultado final.
- **Encontre a Bandeira:** leia o nome do país, território ou entidade e escolha sua bandeira entre três cards visuais. Os nomes das alternativas são revelados depois da resposta.
- **Memória das Bandeiras:** encontre pares em um tabuleiro de quatro colunas, acompanhe jogadas e sequências e escolha entre 20, 24 ou 28 cartas.

## Dificuldades do quiz

Os jogos **Qual é a Bandeira?** e **Encontre a Bandeira** usam os mesmos quatro níveis editoriais calibrados para o público brasileiro. A classificação pertence ao núcleo compartilhado dos quizzes e não altera o catálogo global nem o jogo Bandeiras Giratórias.

| Nível        | Curadoria                                                 | Distribuição em 10 rodadas                       | Multiplicador |
| ------------ | --------------------------------------------------------- | ------------------------------------------------ | ------------- |
| Fácil        | Bandeiras muito presentes no Brasil e no mundo            | 10 fáceis                                        | ×1            |
| Médio        | Bandeiras vistas em esportes, notícias, viagens e cultura | 7 médias + 3 fáceis                              | ×1,2          |
| Difícil      | Países soberanos de menor exposição                       | 6 difíceis + 3 médias + 1 fácil                  | ×1,6          |
| Especialista | Prioriza territórios, dependências e ilhas raras          | 5 especialistas + 3 difíceis + 1 média + 1 fácil | ×2            |

As 262 bandeiras estão classificadas exatamente uma vez: 43 fáceis, 90 médias, 70 difíceis e 59 especialistas. A seleção é acumulada para introduzir variedade sem perder a predominância do nível escolhido.

Cada acerto vale 100 pontos. A partir do terceiro acerto consecutivo, passa a valer 125; depois, o total é multiplicado pelo nível da partida:

| Nível        | Acerto normal | Com bônus de sequência |
| ------------ | ------------: | ---------------------: |
| Fácil        |           100 |                    125 |
| Médio        |           120 |                    150 |
| Difícil      |           160 |                    200 |
| Especialista |           200 |                    250 |

Ao terminar qualquer um dos quizzes, **Jogar novamente** preserva o nível, **Trocar dificuldade** retorna ao seletor e **Voltar aos jogos** retorna à lista. Durante uma partida, voltar abandona a rodada atual e retorna ao seletor; a partir do seletor, voltar retorna à lista de jogos.

As respostas usam três opções da mesma faixa intrínseca. Assets com os mesmos pixels compartilham uma identidade visual e nunca aparecem juntos: Austrália/Heard e McDonald, Clipperton/França/São Martinho, Diego Garcia/Território Britânico do Oceano Índico, Ceuta e Melilla/Espanha, Noruega/Svalbard e Jan Mayen e Estados Unidos/Ilhas Menores Distantes dos EUA.

## Dificuldade do jogo da memória

No jogo **Memória das Bandeiras**, a dificuldade altera somente o tamanho do tabuleiro. A classificação editorial dos quizzes não participa do sorteio.

| Nível   | Cartas | Pares | Linhas de quatro |
| ------- | -----: | ----: | ---------------: |
| Fácil   |     20 |    10 |                5 |
| Médio   |     24 |    12 |                6 |
| Difícil |     28 |    14 |                7 |

A primeira carta permanece aberta até a segunda escolha. Um par correto fica revelado, incrementa a sequência e reproduz o efeito de acerto; um erro mantém as duas cartas visíveis por 900 ms, reinicia a sequência e bloqueia o tabuleiro até o fim da animação de fechamento.

## DEMO

https://github.com/user-attachments/assets/c29939c2-64c9-4300-ac6b-ac4f62b13f5e

## Requisitos

- Node.js 20+
- npm
- Expo CLI
- Android Studio ou Xcode para execução em emuladores

## Instalação

```bash
npm install
```

## Execução

```bash
npx expo start --clear
```

Abra o Expo Go 54 no aparelho físico, mantenha computador e aparelho na mesma rede e escaneie o QR Code exibido pelo terminal.

## Execução em Android

```bash
npx expo run:android
```

## Execução em iOS

```bash
npx expo run:ios
```

## Qualidade e validação

```bash
npm run typecheck
npm run lint
npm run format:check
npx expo install --check
```

O lint usa a configuração flat do ESLint 9 e falha se encontrar qualquer warning.

## Estrutura principal

```text
src/
  app/
  features/
    flag-game/
    find-flag-game/
    guess-flag-game/
    memory-game/
  shared/
    domain/flags/
    gameplay/flag-quiz/
    utils/
docs/
  handoffs/
```

Cada modalidade mantém tela e apresentação próprias em sua feature. O tipo e o catálogo ficam em `src/shared/domain/flags/`, enquanto as regras reutilizadas pelos dois quizzes ficam em `src/shared/gameplay/flag-quiz/`. Em `src/shared/utils/` ficam apenas utilitários puros usados por mais de um jogo, como o Fisher–Yates imutável. A pasta `docs/handoffs/` mantém o histórico das sessões que alteram comportamento, arquitetura ou navegação.

## Adicionar uma nova bandeira

- Para uma inclusão manual, edite `REGION_FLAGS` ou `SUBDIVISION_FLAGS` em `src/shared/domain/flags/flags.data.ts`, mantendo o formato de tupla já usado no arquivo.
- Para atualizar o catálogo Unicode completo, prefira executar o gerador com um `emoji-test.txt` oficial. Ele sobrescreve `flags.data.ts`, portanto alterações manuais devem ser reconciliadas antes da regeneração.
- Depois de alterar o catálogo, execute `node scripts/download-flag-assets.mjs` para baixar os PNGs correspondentes e reconstruir o mapa estático de assets.

## Adicionar um novo jogo

- Adicione a opção em src/features/game-selection/data/game-options.ts
- Crie uma feature independente em `src/features/<nome-do-jogo>/`
- Registre a constante tipada em `src/shared/constants/routes.ts` e `src/shared/types/navigation.ts`
- Registre a tela em `src/app/navigation/AppNavigator.tsx`
- Gere ou atualize o handoff específico da sessão em `docs/handoffs/`

## Áudio

O botão da tela Welcome reproduz e pausa o tema local `src/shared/assets/audio/welcome-theme.wav`. O player usa `expo-audio`, compatível com o Expo Go do SDK 54.

Os dois quizzes usam três efeitos locais em `src/shared/assets/audio/game-effects/`:

- `correct-answer.wav`
- `incorrect-answer.wav`
- `game-finished.wav`

O jogo da memória reutiliza `correct-answer.wav` exatamente uma vez por par encontrado, inclusive no último par. Não reproduz som ao abrir a primeira carta nem em um erro.

Para recriar o tema e os efeitos originais:

```bash
node scripts/generate-welcome-theme.mjs
node scripts/generate-game-effects.mjs
```

Os dois geradores usam o mesmo escritor PCM/WAV em `scripts/wav-utils.mjs`, evitando duas implementações do cabeçalho binário.

Para substituir ou adicionar efeitos, mantenha arquivos WAV válidos, importe-os estaticamente no hook compartilhado de áudio e preserve o fallback que impede falhas de áudio de interromper a partida. Não use `expo-av`.

## Catálogo de bandeiras

O catálogo possui 262 bandeiras RGI do Unicode Emoji 17.0: 259 de países/regiões e as bandeiras de Inglaterra, Escócia e País de Gales. No jogo Bandeiras Giratórias, 30 bandeiras são sorteadas ao iniciar ou tocar em Sortear novamente; nos quizzes, uma bandeira é usada como pergunta ou alternativa em cada uma das dez rodadas conforme a distribuição da dificuldade escolhida; na memória, são sorteadas 10, 12 ou 14 identidades visuais e cada uma gera exatamente duas cartas.

A curadoria fica em `src/shared/gameplay/flag-quiz/data/flag-difficulty.data.ts`. Ao alterar o catálogo compartilhado, atualize também essa classificação e os grupos de equivalência visual quando necessário. O validador do núcleo verifica quantidade, IDs duplicados, IDs desconhecidos e bandeiras sem nível.

O arquivo pode ser regenerado a partir do `emoji-test.txt` oficial. O gerador aceita somente o cabeçalho `# Version: 17.0`, evitando substituir silenciosamente o catálogo por outra versão:

```bash
node scripts/generate-flags-data.mjs /caminho/para/emoji-test.txt
node scripts/download-flag-assets.mjs
```

As bandeiras são imagens PNG locais do [Twemoji](https://github.com/jdecked/twemoji), empacotadas pelo Metro para funcionar sem internet e sem depender da fonte de emojis do aparelho. Os gráficos são licenciados sob [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).

## Bibliotecas utilizadas

- expo
- expo-audio
- expo-screen-orientation
- react-navigation
- react-native-reanimated
- react-native-gesture-handler

## Limitações desta versão

- As bandeiras seguem o estilo visual do Twemoji, que pode diferir do emoji nativo do aparelho.
- Os quizzes ainda não possuem cronômetro nem persistência de melhor pontuação.
- O jogo da memória ainda não possui cronômetro, ranking nem persistência de melhor resultado.
- A dificuldade representa familiaridade estimada para o público brasileiro e deve evoluir por curadoria e feedback, não por uma métrica universal de países.
