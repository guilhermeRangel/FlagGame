# Flag World

Flag World é um jogo mobile em React Native + Expo criado para explorar bandeiras, países e interações leves em uma primeira versão funcional.

## Jogos disponíveis

- **Bandeiras Giratórias:** toque em cada bandeira até quatro vezes; ao esgotar os giros, o card fica indisponível.
- **Qual é a Bandeira?:** identifique o país correto entre três alternativas em uma partida de dez rodadas, com pontuação, bônus de sequência, feedback visual/sonoro e resultado final.

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

## Estrutura principal

```text
src/
  app/
  features/
    flag-game/
    guess-flag-game/
  shared/
    domain/flags/
docs/
  handoffs/
```

Cada jogo deve permanecer isolado em sua própria feature. Conceitos realmente globais, como o tipo e o catálogo de bandeiras, ficam em `src/shared/domain/flags/`. A pasta `docs/handoffs/` mantém o histórico das sessões que alteram comportamento, arquitetura ou navegação.

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

O jogo Qual é a Bandeira? usa três efeitos locais em `src/shared/assets/audio/game-effects/`:

- `correct-answer.wav`
- `incorrect-answer.wav`
- `game-finished.wav`

Para recriar o tema e os efeitos originais:

```bash
node scripts/generate-welcome-theme.mjs
node scripts/generate-game-effects.mjs
```

Para substituir ou adicionar efeitos, mantenha arquivos WAV válidos, importe-os estaticamente no hook de áudio da feature e preserve o fallback que impede falhas de áudio de interromper a partida. Não use `expo-av`.

## Catálogo de bandeiras

O catálogo possui 262 bandeiras RGI do Unicode Emoji 17.0: 259 de países/regiões e as bandeiras de Inglaterra, Escócia e País de Gales. No jogo Bandeiras Giratórias, 30 bandeiras são sorteadas ao iniciar ou tocar em Sortear novamente; no quiz, uma bandeira é exibida em cada uma das dez rodadas.

O arquivo pode ser regenerado a partir do `emoji-test.txt` oficial:

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
- O jogo ainda não possui cronômetro, níveis de dificuldade ou persistência de melhor pontuação.
