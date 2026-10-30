#!/usr/bin/env node
// Integração com o Zernio (https://zernio.com) para gerenciar as redes sociais
// do Bilhete Premiado. Roda localmente com Node 20+ e não faz parte do site:
// a Netlify publica só a pasta `public`, então a chave nunca chega ao navegador.
//
// Uso (na raiz do projeto):
//   node --env-file=.env zernio/zernio.mjs perfis
//   node --env-file=.env zernio/zernio.mjs contas
//   node --env-file=.env zernio/zernio.mjs conectar instagram
//   node --env-file=.env zernio/zernio.mjs agendar --conta <accountId> --plataforma instagram \
//     --texto "Legenda" --midia https://exemplo.com/foto.jpg --data 2026-11-05T15:00:00-03:00

const BASE_URL = "https://zernio.com/api/v1";
const PERFIL_ID = process.env.ZERNIO_PROFILE_ID;

async function zernio(path, { method = "GET", body } = {}) {
  const apiKey = process.env.ZERNIO_API_KEY;
  if (!apiKey) throw new Error("Defina ZERNIO_API_KEY no arquivo .env (veja .env.example).");

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`Zernio ${method} ${path} -> HTTP ${res.status}: ${JSON.stringify(data)}`);
  return data;
}

function exigirPerfil() {
  if (!PERFIL_ID) throw new Error("Defina ZERNIO_PROFILE_ID no arquivo .env (veja .env.example).");
  return PERFIL_ID;
}

function lerOpcoes(args) {
  const opcoes = {};
  for (let i = 0; i < args.length; i += 2) {
    if (!args[i].startsWith("--")) throw new Error(`Opção inválida: ${args[i]}`);
    opcoes[args[i].slice(2)] = args[i + 1];
  }
  return opcoes;
}

const comandos = {
  async perfis() {
    const { profiles } = await zernio("/profiles");
    for (const p of profiles) console.log(`${p._id}  ${p.name}  (${p.accountCount} contas)`);
  },

  async contas() {
    const { accounts } = await zernio(`/accounts?profileId=${exigirPerfil()}`);
    if (accounts.length === 0) console.log("Nenhuma conta conectada a este perfil.");
    for (const a of accounts) console.log(`${a._id}  ${a.platform}  ${a.username ?? ""}`);
  },

  // Gera o link de autorização; a conta só é conectada depois que o
  // proprietário abre o link e autoriza na própria plataforma.
  async conectar(plataforma) {
    if (!plataforma) throw new Error("Informe a plataforma, ex.: conectar instagram");
    const { authUrl } = await zernio(`/connect/${plataforma}?profileId=${exigirPerfil()}`);
    console.log(authUrl);
  },

  // Publicação real: exige data futura e nunca publica na hora.
  async agendar(...args) {
    const { conta, plataforma, texto, midia, data } = lerOpcoes(args);
    if (!conta || !plataforma || !texto || !data) {
      throw new Error("Obrigatórios: --conta, --plataforma, --texto e --data (ISO 8601, no futuro).");
    }
    if (!(new Date(data) > new Date())) throw new Error("--data precisa ser uma data futura.");

    const { post } = await zernio("/posts", {
      method: "POST",
      body: {
        content: texto,
        platforms: [{ platform: plataforma, accountId: conta }],
        scheduledFor: new Date(data).toISOString(),
        ...(midia ? { mediaItems: [{ type: "image", url: midia }] } : {}),
      },
    });
    console.log(`Agendado: ${post._id} (${post.status})`);
  },
};

const [comando, ...args] = process.argv.slice(2);
if (!comandos[comando]) {
  console.error(`Comandos: ${Object.keys(comandos).join(", ")}`);
  process.exit(1);
}
comandos[comando](...args).catch((err) => {
  console.error(err.message);
  process.exit(1);
});
