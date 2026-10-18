
export default async () => {
  const token = process.env.META_CATALOG_ACCESS_TOKEN;
  const catalogId = "2143195132981158";

  if (!token) {
    return Response.json(
      { erro: "Token não configurado" },
      { status: 500 }
    );
  }

  try {
    const url = new URL(
      `https://graph.facebook.com/v24.0/${catalogId}`
    );
    url.searchParams.set("fields", "id,name");
    url.searchParams.set("access_token", token);

    const resposta = await fetch(url);
    const dados = await resposta.json();

    return Response.json({
      conexao: resposta.ok ? "OK" : "ERRO",
      status: resposta.status,
      catalogo: resposta.ok ? dados : undefined,
      erro: resposta.ok ? undefined : dados.error?.message
    }, { status: resposta.ok ? 200 : 502 });

  } catch {
    return Response.json(
      { erro: "Falha na consulta à Meta" },
      { status: 502 }
    );
  }
};
