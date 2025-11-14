import { createClient, SupabaseClient } from "@supabase/supabase-js";
import * as argon2 from "argon2";
import * as jwt from "jsonwebtoken";

/**
 * 🚨 GARANTIA DE EXECUÇÃO APENAS NO SERVER-SIDE
 *
 * Este arquivo deve ser usado apenas em rotas server-side (API ou middleware).
 * Evita que o Firebase Admin seja importado no cliente, o que quebraria o build.
 */
if (typeof window !== "undefined") {
  throw new Error(
    "⚠️ Este módulo (supabase server) não pode ser importado no client-side."
  );
}

/* -------------------------------------------------------------------------- */
/* 🧩 1. Validação das variáveis de ambiente                                   */
/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
/* Supabase server initialization                                             */
/* -------------------------------------------------------------------------- */
const requiredEnvVars = {
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  storageBucket:
    process.env.SUPABASE_STORAGE_BUCKET ||
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
};

for (const [key, value] of Object.entries(requiredEnvVars)) {
  if (!value) {
    throw new Error(`❌ Missing required environment variable: ${key}`);
  }
}

export const supabase = createClient(
  requiredEnvVars.supabaseUrl!,
  requiredEnvVars.supabaseServiceRoleKey!,
  { auth: { persistSession: false } }
);

/* -------------------------------------------------------------------------- */
/* Simple Firestore-like adapter over Supabase for server-side routes          */
/* This implements only the subset of Firestore API that the project uses.    */
/* -------------------------------------------------------------------------- */
type DocResult = {
  id: string;
  data: any;
};

class CollectionRef {
  table: string;
  filters: Array<{ field: string; op: string; value: any }> = [];
  _limit?: number;
  _order?: { field: string; asc: boolean };
  _offset?: number;

  constructor(table: string) {
    this.table = table;
  }

  where(field: string, op: string, value: any) {
    this.filters.push({ field, op, value });
    return this;
  }

  limit(n: number) {
    this._limit = n;
    return this;
  }

  orderBy(field: string, dir: "asc" | "desc" = "asc") {
    this._order = { field, asc: dir === "asc" };
    return this;
  }

  offset(n: number) {
    this._offset = n;
    return this;
  }

  async get() {
    let query = supabase.from(this.table).select("*");

    for (const f of this.filters) {
      if (f.op === "==") query = query.eq(f.field, f.value);
      else if (f.op === "in") query = query.in(f.field, f.value);
      else if (f.op === ">") query = query.gt(f.field, f.value);
      else if (f.op === "<") query = query.lt(f.field, f.value);
      else query = query.eq(f.field, f.value);
    }

    if (this._order) {
      query = query.order(this._order.field, { ascending: this._order.asc });
    }

    if (typeof this._limit === "number" && typeof this._offset === "number") {
      const start = this._offset;
      const end = this._offset + this._limit - 1;
      query = query.range(start, end);
    } else if (typeof this._limit === "number") {
      query = query.limit(this._limit);
    } else if (typeof this._offset === "number") {
      query = query.range(this._offset, this._offset + 999999);
    }

    const { data, error } = await query;
    if (error) throw error;

    const docs = (data || []).map((row: any) => ({
      id: row.id || row.uid || row.uuid || String(row),
      // return a camelCase view for application code
      data: () => snakeToCamel(row),
      get: (field: string) => row[camelToSnake(field)],
      exists: true,
    }));

    return { docs, size: docs.length, empty: docs.length === 0 };
  }

  async add(payload: any) {
    // convert payload keys to snake_case before inserting into Postgres
    const snakePayload = toSnakeKeys(payload);
    const { data, error } = await supabase
      .from(this.table)
      .insert([snakePayload])
      .select()
      .single();
    if (error) throw error;
    return { id: data.id };
  }

  doc(id: string) {
    const table = this.table;
    return {
      id,
      async get() {
        const { data, error } = await supabase
          .from(table)
          .select("*")
          .eq("id", id)
          .maybeSingle();
        if (error) throw error;
        return {
          exists: !!data,
          id: data?.id,
          data: () => (data ? snakeToCamel(data) : data),
          get: (field: string) => data?.[camelToSnake(field)],
        };
      },
      async update(payload: any) {
        const snakePayload = toSnakeKeys(payload);
        const { error } = await supabase
          .from(table)
          .update(snakePayload)
          .eq("id", id);
        if (error) throw error;
        return true;
      },
    };
  }
}

export const db = {
  collection(name: string) {
    return new CollectionRef(name);
  },
  async getAll(...docRefs: Array<{ id: string }>) {
    // Assumes all docRefs are from same table and have an 'id' property
    if (!docRefs.length) return [];
    // fallback: fetch each individually
    const results = [] as any[];
    for (const r of docRefs) {
      const { data, error } = await supabase
        .from((r as any).__table || "usuarios")
        .select("*")
        .eq("id", r.id)
        .maybeSingle();
      if (error) throw error;
      results.push({
        exists: !!data,
        id: data?.id,
        data: () => (data ? snakeToCamel(data) : data),
        get: (f: string) => data?.[camelToSnake(f)],
      });
    }
    return results;
  },
};

// ----------------------
// Helpers: camel <-> snake
// ----------------------
function camelToSnake(key: string) {
  return key.replace(/([A-Z])/g, (m) => `_${m.toLowerCase()}`);
}

function snakeToCamelKey(key: string) {
  return key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}

function toSnakeKeys(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) return obj.map(toSnakeKeys);
  if (typeof obj !== "object") return obj;
  const out: any = {};
  for (const k of Object.keys(obj)) {
    const v = obj[k];
    out[camelToSnake(k)] = toSnakeKeys(v);
  }
  return out;
}

function snakeToCamel(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) return obj.map(snakeToCamel);
  if (typeof obj !== "object") return obj;
  const out: any = {};
  for (const k of Object.keys(obj)) {
    const v = obj[k];
    out[snakeToCamelKey(k)] = snakeToCamel(v);
  }
  return out;
}

export const storage = {
  async uploadFile(
    bucket: string,
    path: string,
    buffer: Buffer,
    contentType?: string
  ) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, buffer, { contentType, upsert: false });
    if (error) throw error;
    return data;
  },
  getPublicUrl(bucket: string, path: string) {
    return supabase.storage.from(bucket).getPublicUrl(path).publicURL;
  },
  async removeFile(bucket: string, path: string) {
    const { error } = await supabase.storage.from(bucket).remove([path]);
    if (error) throw error;
    return true;
  },
};

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
export async function authenticateUser(
  loginData: LoginData
): Promise<AuthResult> {
  try {
    const { email, senha } = loginData;
    // Try to sign in with Supabase Auth (server-side)
    try {
      const { data: signInData, error: signInError } =
        await supabase.auth.signInWithPassword({
          email,
          password: senha,
        } as any);

      if (signInError) {
        // Authentication failed at Supabase level
        return { success: false, error: "Email ou senha incorretos" };
      }

      const userId = signInData?.user?.id;

      // Fetch profile from usuarios table
      const { data: profile, error: profileError } = await supabase
        .from("usuarios")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (profileError) {
        console.error(
          "Error fetching user profile after sign-in:",
          profileError
        );
        return { success: false, error: "Erro interno do servidor" };
      }

      if (!profile) {
        // If there's no profile row, return minimal user info
        return {
          success: true,
          user: {
            id: userId,
            email,
            nome: "",
            cargo: "",
            ra: "",
          },
        };
      }

      return {
        success: true,
        user: {
          id: profile.id,
          email: profile.email,
          nome: profile.nome,
          cargo: profile.cargo,
          ra: profile.ra,
        },
      };
    } catch (err) {
      console.error("Supabase sign-in error:", err);
      return { success: false, error: "Erro interno do servidor" };
    }
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

export async function verifySessionToken(
  token: string
): Promise<jwt.JwtPayload | null> {
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
export { supabase as firebaseAdmin };
