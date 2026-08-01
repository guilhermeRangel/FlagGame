# Flag World

Flag World é um jogo mobile em React Native + Expo criado para explorar bandeiras, países e interações leves em uma primeira versão funcional.

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
  shared/
```

## Adicionar uma nova bandeira

- Edite o arquivo src/features/flag-game/data/flags.data.ts
- Adicione um novo objeto com id, countryName e visual

## Adicionar um novo jogo

- Adicione a opção em src/features/game-selection/data/game-options.ts
- Crie a tela correspondente e registre a rota em src/app/navigation/AppNavigator.tsx

## Áudio

O botão da tela Welcome reproduz e pausa o tema local `src/shared/assets/audio/welcome-theme.wav`. O player usa `expo-audio`, compatível com o Expo Go do SDK 54.

Para recriar o tema original:

```bash
node scripts/generate-welcome-theme.mjs
```

## Catálogo de bandeiras

O catálogo possui 262 bandeiras RGI do Unicode Emoji 17.0: 259 de países/regiões e as bandeiras de Inglaterra, Escócia e País de Gales. A cada rodada, 30 são sorteadas para manter a grade leve.

O arquivo pode ser regenerado a partir do `emoji-test.txt` oficial:

```bash
node scripts/generate-flags-data.mjs /caminho/para/emoji-test.txt
```

## Bibliotecas utilizadas

- expo
- expo-audio
- expo-screen-orientation
- react-navigation
- react-native-reanimated
- react-native-gesture-handler

## Limitações desta versão

- A primeira versão usa emojis como representação visual das bandeiras.
- Apenas o modo Bandeiras Giratórias está habilitado.
- A aparência de algumas bandeiras recentes depende do suporte a emojis instalado no aparelho.
