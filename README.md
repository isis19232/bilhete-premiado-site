# Bilhete Premiado

Site informativo do Bilhete Premiado, preparado a partir dos arquivos fornecidos. Apresenta os sorteios, explica a dinâmica, responde às dúvidas frequentes e oferece contato pelo WhatsApp.

O projeto usa HTML, CSS e JavaScript nativos, sem dependências ou etapa de compilação. O layout adapta-se a celulares e computadores. As fontes são carregadas pelo Google Fonts e o Meta Pixel (2095003327789179) só é ativado depois que o visitante aceita o aviso de privacidade. Ele registra PageView, ViewContent (seções Como funciona, Informações e FAQ) e Contact (cliques no WhatsApp, com cidade, vendedor, botão, página e campanha UTM) por meio de `pixel-events.js`. Para um novo botão de WhatsApp por cidade, basta adicionar `data-bp-button`, `data-bp-city` e `data-bp-seller` ao link.

## Uso local

Para visualizar localmente, execute `python3 -m http.server 8080 --directory public` e abra `http://localhost:8080`.

## Publicação e manutenção

A Netlify publica a pasta `public`, conforme `netlify.toml`. Edite `public/index.html` para atualizar textos, informações e links de contato; os estilos ficam em `public/styles.css`. As imagens originais estão na mesma pasta. Não há backend, cadastro, compra de bilhetes ou armazenamento de dados no projeto.
