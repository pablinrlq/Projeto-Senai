import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, db } from "@/lib/firebase/admin";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Token de autorização necessário" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    const decodedToken = await verifySessionToken(token);

    if (!decodedToken || !decodedToken.uid) {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 });
    }

    // Check if user is admin
    const userDoc = await db.collection("usuarios").doc(decodedToken.uid).get();
    if (!userDoc.exists || userDoc.data()?.cargo !== "ADMINISTRADOR") {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }

    // Get all atestados for admin review (order by DB column created_at)
    const atestadosSnapshot = await db
      .collection("atestados")
      .orderBy("created_at", "desc")
      .get();

    const atestados = await Promise.all(
      atestadosSnapshot.docs.map(async (doc) => {
        const atestadoData = doc.data();

        // Get user info (adapter returns camelCase keys)
        let usuario = null;
        const ownerId = atestadoData.idUsuario || atestadoData.userId || null;
        if (ownerId) {
          const userDoc = await db.collection("usuarios").doc(ownerId).get();
          if (userDoc.exists) {
            const userData = userDoc.data();
            usuario = {
              id: userDoc.id,
              nome: userData?.nome || "N/A",
              email: userData?.email || "N/A",
              ra: userData?.ra || "N/A",
            };
          }
        }

        return {
          id: doc.id,
          data_inicio:
            atestadoData.dataInicio || atestadoData.data_inicio || null,
          data_fim: atestadoData.dataFim || atestadoData.data_fim || null,
          motivo: atestadoData.motivo || "",
          status: atestadoData.status || "pendente",
          imagem:
            atestadoData.imagemAtestado ||
            atestadoData.imagem_atestado ||
            atestadoData.imagem_url ||
            "",
          createdAt:
            atestadoData.createdAt || atestadoData.created_at
              ? new Date(
                  atestadoData.createdAt || atestadoData.created_at
                ).toISOString()
              : new Date().toISOString(),
          observacoes_admin:
            atestadoData.observacoesAdmin ||
            atestadoData.observacoes_admin ||
            "",
          usuario,
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: atestados,
    });
  } catch (error) {
    console.error("Error in admin atestados route:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
