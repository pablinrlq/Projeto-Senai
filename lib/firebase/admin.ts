import admin, { type ServiceAccount } from "firebase-admin";
import * as argon2 from "argon2";
import * as jwt from "jsonwebtoken";

/**
 * 🚨 GARANTIA DE EXECUÇÃO APENAS NO SERVER-SIDE
 * 
 * Este arquivo deve ser usado apenas em rotas server-side (API ou middleware).
 * Evita que o Firebase Admin seja importado no cliente, o que quebraria o build.
 */
if (typeof window !== "undefined") {
  throw new Error("⚠️ firebase-admin não pode ser importado no client-side.");
}

/* -------------------------------------------------------------------------- */
/* 🧩 1. Validação das variáveis de ambiente                                   */
/* -------------------------------------------------------------------------- */
const requiredEnvVars = {
  projectId: process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY,
};

for (const [key, value] of Object.entries(requiredEnvVars)) {
  if (!value) {
    throw new Error(`❌ Missing required environment variable: ${key}`);
  }
}

/* -------------------------------------------------------------------------- */
/* 🔥 2. Inicialização segura do Firebase Admin                                */
/* -------------------------------------------------------------------------- */
const serviceAccount: ServiceAccount = {
  projectId: requiredEnvVars.projectId!,
  clientEmail: requiredEnvVars.clientEmail!,
  privateKey: requiredEnvVars.privateKey!.replace(/\\n/g, "\n"),
};

export function getFirebaseAdmin() {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: `https://${requiredEnvVars.projectId}.firebaseio.com`,
      storageBucket: `${requiredEnvVars.projectId}.appspot.com`,
    });
  }
  return admin;
}

const firebaseAdmin = getFirebaseAdmin();

export const db = firebaseAdmin.firestore();
export const auth = firebaseAdmin.auth();
export const storage = firebaseAdmin.storage();

/* -------------------------------------------------------------------------- */
/* 🔐 3. Tipos auxiliares                                                      */
/* -------------------------------------------------------------------------- */
export interface AuthResult {
  success: boolean;
  error?: string;
  user?: {
    id: string;
    email: string;
    nome: string;
    cargo: string;
    ra: string;
  };
}

export interface LoginData {
  email: string;
  senha: string;
}

/* -------------------------------------------------------------------------- */
/* 👤 4. Autenticação com Firestore e Argon2                                   */
/* -------------------------------------------------------------------------- */
export async function authenticateUser(loginData: LoginData): Promise<AuthResult> {
  try {
    const { email, senha } = loginData;

    const userQuery = await db
      .collection("usuarios")
      .where("email", "==", email)
      .limit(1)
      .get();

    if (userQuery.empty) {
      return { success: false, error: "Email ou senha incorretos" };
    }

    const userDoc = userQuery.docs[0];
    const userData = userDoc.data();

    // Verifica a senha com Argon2
    const isPasswordValid = await argon2.verify(userData.senha, senha);
    if (!isPasswordValid) {
      return { success: false, error: "Email ou senha incorretos" };
    }

    return {
      success: true,
      user: {
        id: userDoc.id,
        email: userData.email,
        nome: userData.nome,
        cargo: userData.cargo,
        ra: userData.ra,
      },
    };
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error authenticating user:", error);
    }
    return { success: false, error: "Erro interno do servidor" };
  }
}

/* -------------------------------------------------------------------------- */
/* 🔑 5. Funções utilitárias de segurança (senha e token)                      */
/* -------------------------------------------------------------------------- */
export async function hashPassword(password: string): Promise<string> {
  try {
    return await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16, // 64 MB
      timeCost: 3,
      parallelism: 1,
    });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error hashing password:", error);
    }
    throw new Error("Falha ao processar senha");
  }
}

export async function createSessionToken(userId: string): Promise<string> {
  try {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) throw new Error("JWT_SECRET não definido.");

    const payload = {
      uid: userId,
      sessionId: `session_${Date.now()}`,
      timestamp: Date.now(),
    };

    return jwt.sign(payload, jwtSecret, {
      expiresIn: "5d",
      issuer: "atestado-stock-app",
      audience: "atestado-stock-users",
    });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error creating session token:", error);
    }
    throw new Error("Falha ao criar token de sessão");
  }
}

export async function verifySessionToken(token: string): Promise<jwt.JwtPayload | null> {
  try {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) throw new Error("JWT_SECRET não definido.");

    return jwt.verify(token, jwtSecret, {
      issuer: "atestado-stock-app",
      audience: "atestado-stock-users",
    }) as jwt.JwtPayload;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error verifying session token:", error);
    }
    return null;
  }
}

/* -------------------------------------------------------------------------- */
/* ✅ 6. Exportações                                                          */
/* -------------------------------------------------------------------------- */
export { firebaseAdmin };
