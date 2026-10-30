# Bilhete Premiado

Site informativo do Bilhete Premiado, preparado a partir dos arquivos fornecidos. Apresenta os sorteios, explica a dinâmica, responde às dúvidas frequentes e oferece contato pelo WhatsApp.

O projeto usa HTML, CSS e JavaScript nativos, sem dependências ou etapa de compilação. O layout adapta-se a celulares e computadores. As fontes são carregadas pelo Google Fonts e o Meta Pixel (1428916645334077) só é ativado depois que o visitante aceita o aviso de privacidade. Ele registra PageView, ViewContent (seções Como funciona, Informações e FAQ) e Contact (cliques no WhatsApp, com cidade, vendedor, botão, página e campanha UTM) por meio de `pixel-events.js`. Para um novo botão de WhatsApp por cidade, basta adicionar `data-bp-button`, `data-bp-city` e `data-bp-seller` ao link.

## Uso local

Para visualizar localmente, execute `python3 -m http.server 8080 --directory public` e abra `http://localhost:8080`.

## Publicação e manutenção

A Netlify publica a pasta `public`, conforme `netlify.toml`. Edite `public/index.html` para atualizar textos, informações e links de contato; os estilos ficam em `public/styles.css`. As imagens originais estão na mesma pasta. Não há backend, cadastro, compra de bilhetes ou armazenamento de dados no projeto.

## Redes sociais (Zernio)

A pasta `zernio/` tem um script local para gerenciar as redes sociais pelo [Zernio](https://zernio.com). Ele não faz parte do site publicado. Copie `.env.example` para `.env`, preencha `ZERNIO_API_KEY` e use, na raiz do projeto:

- `node --env-file=.env zernio/zernio.mjs perfis` — lista os perfis.
- `node --env-file=.env zernio/zernio.mjs contas` — lista as contas conectadas ao perfil Bilhete Premiado.
- `node --env-file=.env zernio/zernio.mjs conectar instagram` — gera o link para autorizar uma conta.
- `node --env-file=.env zernio/zernio.mjs agendar --conta <id> --plataforma instagram --texto "Legenda" --midia <url da imagem> --data 2026-11-05T15:00:00-03:00` — agenda uma publicação real (a data precisa ser futura).
