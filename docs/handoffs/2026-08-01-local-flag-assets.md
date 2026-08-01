# Handoff da sessão — Bandeiras locais

Data: 2026-08-01

## Objetivo

Corrigir as bandeiras e ícones que apareciam como `?` no Expo Go. O catálogo continha code points Unicode válidos, mas a renderização dependia da fonte de emojis do sistema, que falhou no runtime observado.

## Causa confirmada

- IDs, nomes e sequências Unicode do catálogo estavam corretos.
- O mesmo fallback aparecia em bandeiras hardcoded da Splash e Welcome, confirmando que o problema não era a geração dos dados.
- O runtime substituía emojis coloridos por glifos de fallback, tornando o jogo de identificação inviável.

## Solução

- Foram adicionados 262 PNGs locais do Twemoji em `src/shared/assets/flags/`.
- `flags.assets.ts` possui imports estáticos para que o Metro descubra e empacote cada imagem.
- `flags.data.ts` agora cria `FlagVisual` do tipo `asset` usando esse mapa.
- Splash, Welcome, Bandeiras Giratórias, Informações e Qual é a Bandeira? passaram a usar imagens locais.
- Emojis decorativos suscetíveis ao mesmo fallback foram trocados por texto ou símbolos comuns.
- A interrogação neutra das alternativas do quiz foi substituída por um ponto para não parecer erro de asset.

O jogo não exige conexão para exibir bandeiras depois que o bundle é instalado.

## Origem e licença

Os PNGs vieram do projeto [Twemoji](https://github.com/jdecked/twemoji), revisão `b6b55fef1e8636b540a6d016a4729ca8cdf2e60b`. Os gráficos são licenciados sob [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). A atribuição também está em `README.md` e `src/shared/assets/flags/README.md`.

## Arquivos principais

- `src/shared/assets/flags/*.png`: 262 imagens.
- `src/shared/domain/flags/flags.assets.ts`: mapa estático.
- `src/shared/domain/flags/flags.data.ts`: catálogo usando assets.
- `scripts/download-flag-assets.mjs`: download, validação PNG e geração do mapa.
- `src/shared/components/AnimatedFlag/AnimatedFlag.tsx`: anima imagens em vez de texto emoji.
- `src/features/flag-game/components/InteractiveFlagCard.tsx`: renderiza o asset da bandeira.
- `src/features/guess-flag-game/components/GuessFlagPrompt/GuessFlagPrompt.tsx`: renderiza o asset em destaque.

## Correção adicional encontrada

Durante o reload do quiz, o React informou chaves duplicadas entre prompt e feedback porque ambos usavam o mesmo ID de rodada. As chaves agora possuem prefixos `prompt:` e `feedback:`.

## Regeneração

Depois de alterar o catálogo:

```bash
node scripts/generate-flags-data.mjs /caminho/para/emoji-test.txt
node scripts/download-flag-assets.mjs
```

O downloader exige rede apenas durante o desenvolvimento. Ele valida quantidade, IDs únicos, status HTTP e assinatura PNG antes de gerar o mapa.

## Validação

- 262 PNGs presentes e válidos.
- TypeScript estrito passou.
- ESLint completo passou sem erros ou warnings de código.
- Bundles Hermes Android e iOS retornaram HTTP 200.
- Welcome foi inspecionada no simulador e mostrou Brasil, Estados Unidos, Japão, França e Alemanha corretamente.
- O quiz foi inspecionado no simulador e mostrou a bandeira sorteada corretamente, sem `?` no lugar da imagem.

## Limitações

- Os PNGs usam o estilo do Twemoji, não o desenho nativo específico de cada sistema.
- O fluxo completo de dez respostas ainda precisa ser percorrido em aparelho físico.
