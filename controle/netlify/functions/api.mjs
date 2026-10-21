// Bilhete Premiado · API de dados
// Guarda o controle de vendas no Netlify Blobs, para ser acessado de qualquer aparelho.
// Exige a senha definida na variável de ambiente APP_SENHA (Netlify > Site configuration > Environment variables).
import { getStore } from "@netlify/blobs";

const CHAVE = "dados";
const NOME_LOJA = "bilhete-premiado";
const LIMITE_BYTES = 5 * 1024 * 1024;

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });
}

function formatoValido(c) {
  return (
    c &&
    typeof c === "object" &&
    Array.isArray(c.vendedores) &&
    Array.isArray(c.lancamentos) &&
    Array.isArray(c.premios)
  );
}

export default async (req) => {
  const senhaEsperada = process.env.APP_SENHA;
  if (!senhaEsperada) {
    return json({ erro: "APP_SENHA não configurada no Netlify" }, 500);
  }
  if ((req.headers.get("x-senha") || "") !== senhaEsperada) {
    return json({ erro: "senha" }, 401);
  }

  const store = getStore(NOME_LOJA);

  if (req.method === "GET") {
    const dados = await store.get(CHAVE, { type: "json" });
    return json(dados || {});
  }

  if (req.method === "PUT") {
    const texto = await req.text();
    if (texto.length > LIMITE_BYTES) return json({ erro: "dados grandes demais" }, 413);

    let corpo;
    try {
      corpo = JSON.parse(texto);
    } catch {
      return json({ erro: "JSON inválido" }, 400);
    }
    if (!formatoValido(corpo)) return json({ erro: "formato inválido" }, 400);

    const doc = {
      versao: 2,
      params: corpo.params && typeof corpo.params === "object" ? corpo.params : {},
      vendedores: corpo.vendedores,
      lancamentos: corpo.lancamentos,
      premios: corpo.premios,
      atualizadoEm: new Date().toISOString(),
    };
    await store.setJSON(CHAVE, doc);
    return json({ ok: true, atualizadoEm: doc.atualizadoEm });
  }

  return json({ erro: "método não permitido" }, 405);
};

export const config = { path: "/api/dados" };
