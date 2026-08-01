O arquivo `welcome-theme.wav` é o tema musical local da tela de boas-vindas.

Ele tem 12 segundos, toca em loop somente após a interação do usuário e pode ser pausado pelo botão Música/Silencioso. O player usa `expo-audio` no Expo SDK 54.

Para regenerar o áudio original a partir do código-fonte do sintetizador:

```bash
node scripts/generate-welcome-theme.mjs
```

## Efeitos do jogo Qual é a Bandeira?

A pasta `game-effects/` contém três efeitos WAV PCM locais e sem dependência de rede:

- `correct-answer.wav`: sequência curta ascendente para acerto.
- `incorrect-answer.wav`: sequência curta descendente para erro.
- `game-finished.wav`: sequência comemorativa ao concluir a partida.

Para regenerar os três arquivos originais:

```bash
node scripts/generate-game-effects.mjs
```

Os efeitos são reproduzidos por `useGuessFlagGameSounds` com `expo-audio`. O hook impede sobreposição, volta o efeito ao início antes de tocar e ignora falhas do aparelho sem quebrar o jogo.
