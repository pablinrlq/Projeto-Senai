import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase/admin";

/**
 * Middleware para rotas server-side que usam o Firebase Admin (Firestore, Auth, etc.)
 *
 * Garante:
 * - Tipagem correta do handler
 * - Tratamento centralizado de erros
 * - Ambiente 100% server-side
 */
export function withFirebaseAdmin(
  handler: (req: NextRequest, db: any) => Promise<any>
): (req: NextRequest) => Promise<NextResponse> {
  return async (req: NextRequest) => {
    try {
      // 👉 Aqui eu posso adicionar validações extras
      // Exemplo: autenticação, rate limiting, etc.
      return await handler(req, db);
    } catch (error) {
      console.error("🔥 Firebase Admin Error:", error);

      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  };
}

/**
 * Função utilitária para executar operações seguras no Firestore
 *
 * Retorna:
 * - data: resultado da operação (ou null)
 * - error: mensagem de erro (ou null)
 */
export async function safeFirestoreOperation<T>(
  operation: () => Promise<T>,
  errorMessage = "Database operation failed"
): Promise<{ data: T | null; error: string | null }> {
  try {
    const data = await operation();
    return { data, error: null };
  } catch (error) {
    console.error("⚠️ Firestore Operation Error:", error);
    return { data: null, error: errorMessage };
  }
}
