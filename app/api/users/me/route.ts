import { NextResponse } from "next/server";
import { withFirebaseAdmin } from "@/lib/firebase/middleware";
import { verifyAuth } from "@/lib/authMiddleware";

export const GET = withFirebaseAdmin(async (req, db) => {
  const authResult = await verifyAuth(req);

  if (!authResult.success) {
    return NextResponse.json(
      { success: false, error: authResult.error },
      { status: authResult.status }
    );
  }

  try {
    const userDoc = await db.collection("usuarios").doc(authResult.uid).get();

    if (!userDoc.exists) {
      return NextResponse.json(
        { success: false, error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    const userData = userDoc.data();

    const user = {
      id: userDoc.id,
      nome: userData?.nome,
      email: userData?.email,
      cargo: userData?.cargo,
      ra: userData?.ra,
      telefone: userData?.telefone,
      createdAt: userData?.createdAt,
    };

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Error fetching current user:", error);
    return NextResponse.json(
      { success: false, error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
});
