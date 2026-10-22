# Controle de vendas · Bilhete Premiado (Firebase)

## 1. Criar o projeto (uma vez)
1. Acesse console.firebase.google.com com a conta Google.
2. **Criar um projeto** (ex.: `controle-bilhete`). Pode desativar o Google Analytics.
3. **Build > Authentication > Começar > E-mail/senha > Ativar.** Deixe "Cadastro de usuário" desativado (só você cria contas).
4. **Authentication > Usuários > Adicionar usuário**: crie uma conta para cada pessoa, com e-mail e senha.
5. **Build > Firestore Database > Criar banco de dados** (modo de produção, região southamerica-east1 ou us-central1).
6. Aba **Regras** do Firestore: apague o conteúdo e cole o conteúdo de `firestore.rules`, trocando os e-mails pelos reais. Clique em **Publicar**.
7. **Configurações do projeto > Seus apps > Adicionar app > Web (</>)**. Copie o objeto `firebaseConfig` e cole no lugar de `FIREBASE_CONFIG` no topo de `public/index.html`.

## 2. Publicar a página (sem terminal)
Opção Cloudflare Pages (gratuito, pelo navegador; os nomes dos botões podem mudar):
1. dash.cloudflare.com > Workers & Pages > **Create > Pages > Upload assets**.
2. Dê um nome (ex.: `controle-bilhete`) e envie a pasta `public` (ou o arquivo `index.html` dentro de uma pasta `public`).
3. Ao final, anote o endereço (ex.: `controle-bilhete.pages.dev`).
4. No Firebase, **Authentication > Configurações > Domínios autorizados**, adicione esse endereço (sem https://).

## 3. Usar
Abra o endereço, entre com o e-mail e a senha da sua conta. Cada pessoa entra com a própria conta e vê os mesmos dados.
