O arquivo `welcome-theme.wav` é o tema musical local da tela de boas-vindas.

Ele tem 12 segundos, toca em loop somente após a interação do usuário e pode ser pausado pelo botão Música/Silencioso. O player usa `expo-audio` no Expo SDK 54.

Para regenerar o áudio original a partir do código-fonte do sintetizador:

```bash
node scripts/generate-welcome-theme.mjs
```
