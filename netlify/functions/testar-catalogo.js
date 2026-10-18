
exports.handler = async () => {
  const token = process.env.META_CATALOG_ACCESS_TOKEN;

  if (!token) {
    return {
      statusCode: 500,
      body: JSON.stringify({ erro: "Token não configurado" })
    };
  }

  try {
    const resposta = await fetch(
      "https://graph.facebook.com/v26.0/2143195132981158?fields=id,name",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    return {
      statusCode: resposta.status,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        conexao: resposta.ok ? "OK" : "Erro",
        status: resposta.status
      })
    };
  } catch {
    return {
      statusCode: 500,
      body: JSON.stringify({ erro: "Falha na conexão" })
    };
  }
};
