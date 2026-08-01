# Flag World

Flag World é um jogo mobile em React Native + Expo criado para explorar bandeiras, países e interações leves em uma primeira versão funcional.

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
npx expo start
```

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
  shared/
```

## Adicionar uma nova bandeira

- Edite o arquivo src/features/flag-game/data/flags.data.ts
- Adicione um novo objeto com id, countryName e visual

## Adicionar um novo jogo

- Adicione a opção em src/features/game-selection/data/game-options.ts
- Crie a tela correspondente e registre a rota em src/app/navigation/AppNavigator.tsx

## Áudio

Adicione o arquivo welcome-theme.mp3 em src/shared/assets/audio/.

## Bibliotecas utilizadas

- expo
- expo-av
- expo-screen-orientation
- react-navigation
- react-native-reanimated
- react-native-gesture-handler

## Limitações desta versão

- A primeira versão usa emojis como representação visual das bandeiras.
- Apenas o modo Bandeiras Giratórias está habilitado.
- A música de fundo é opcional e usa um fallback seguro quando o arquivo de áudio não está presente.
