O arquivo `welcome-theme.wav` é o tema musical local da tela de boas-vindas.

Ele tem 12 segundos, toca em loop somente após a interação do usuário e pode ser pausado pelo botão Música/Silencioso. O player usa `expo-audio` no Expo SDK 54.

Para regenerar o áudio original a partir do código-fonte do sintetizador:

```bash
node scripts/generate-welcome-theme.mjs
```

## Efeitos dos jogos

A pasta `game-effects/` contém três efeitos WAV PCM locais e sem dependência de rede:

- `correct-answer.wav`: sequência curta ascendente para acerto.
- `incorrect-answer.wav`: sequência curta descendente para erro.
- `game-finished.wav`: sequência comemorativa ao concluir a partida.

Para regenerar os três arquivos originais:

```bash
node scripts/generate-game-effects.mjs
```

Os dois quizzes reproduzem os efeitos por `useFlagQuizGameSounds` com `expo-audio`. O jogo da memória reutiliza `correct-answer.wav` por `useMemoryGameSounds`, uma vez para cada par confirmado. Os hooks impedem sobreposição, voltam o efeito ao início antes de tocar e ignoram falhas do aparelho sem quebrar o jogo.

Os geradores do tema e dos efeitos compartilham o escritor PCM/WAV de `scripts/wav-utils.mjs`.
