import { withFirebaseAdmin } from "@/lib/firebase/middleware";

export interface AuthUser {
  id: string;
  nome: string;
  email: string;
  cargo: "ADMINISTRADOR" | "USUARIO" | "FUNCIONARIO";
  ra: string;
  telefone?: string;
}

export interface AuthResult {
  success: boolean;
  user?: AuthUser;
  error?: string;
}

export const verifyAuthToken = async (token: string): Promise<AuthResult> => {
  try {
    if (!token) {
      return { success: false, error: "Token não fornecido" };
    }

    const email = token;

    return new Promise((resolve) => {
      withFirebaseAdmin(async (req, db) => {
        try {
          const userSnapshot = await db
            .collection("usuarios")
            .where("email", "==", email)
            .limit(1)
            .get();

          if (userSnapshot.empty) {
            resolve({ success: false, error: "Usuário não encontrado" });
            return;
          }

          const userDoc = userSnapshot.docs[0];
          const userData = userDoc.data();

          const user: AuthUser = {
            id: userDoc.id,
            nome: userData.nome,
            email: userData.email,
            cargo: userData.cargo,
            ra: userData.ra,
            telefone: userData.telefone,
          };

          resolve({ success: true, user });
        } catch (error) {
          console.error("Token verification error:", error);
          resolve({ success: false, error: "Erro ao verificar token" });
        }
      })(new Request("http://localhost") as any);
    });
  } catch (error) {
    console.error("Auth verification error:", error);
    return { success: false, error: "Erro de autenticação" };
  }
};

export const requireAdmin = async (token: string): Promise<AuthResult> => {
  const authResult = await verifyAuthToken(token);

  if (!authResult.success) {
    return authResult;
  }

  if (authResult.user?.cargo !== "ADMINISTRADOR") {
    return { success: false, error: "Acesso negado. Apenas administradores." };
  }

  return authResult;
};
