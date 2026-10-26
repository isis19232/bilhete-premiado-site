# Arquitetura do projeto

Este é o site estático Bilhete Premiado. Os arquivos enviados pelo proprietário foram preservados como base visual e de conteúdo. Não há framework, gerenciador de pacotes ou compilação.

- `public/index.html`: página inicial em português brasileiro, navegação por âncoras, FAQ com elementos nativos `details` e links externos do WhatsApp.
- `public/styles.css`: identidade verde e dourada, estilos responsivos, estados de foco e preferência por movimento reduzido.
- `public/logo.png` e `public/mascote-hero.png`: imagens fornecidas pelo proprietário.
- `netlify.toml`: publicação da pasta `public`.

Prefira alterações pontuais e mantenha os caminhos absolutos das imagens e do CSS. Preserve a identidade visual, o conteúdo fornecido, a acessibilidade e o comportamento responsivo. Não adicione ferramentas de build para alterações simples. O Meta Pixel existente pertence ao material fornecido. Não há dados persistidos nem serviços de backend implementados.
