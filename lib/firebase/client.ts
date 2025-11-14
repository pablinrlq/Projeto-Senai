import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  // In browser builds the env vars should be present; throw in dev to help debugging
  if (process.env.NODE_ENV === "development") {
    console.warn(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY"
    );
  }
}

export const app = createClient(SUPABASE_URL || "", SUPABASE_ANON_KEY || "");
export const db = app; // kept name for compatibility
export const storage = app.storage;

export default app;
