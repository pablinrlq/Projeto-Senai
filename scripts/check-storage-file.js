#!/usr/bin/env node
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Defina SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no .env");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function checkFile(bucket, path) {
  console.log("Checking", bucket, path);
  try {
    // Try listing the file's directory first
    const dir = path.split("/").slice(0, -1).join("/");
    const { data: list, error: listErr } = await supabase.storage
      .from(bucket)
      .list(dir || "/", { limit: 100 });
    if (listErr) console.warn("List warning:", listErr.message || listErr);
    else console.log("List returned", (list || []).length, "items");

    // Try download
    const { data, error } = await supabase.storage.from(bucket).download(path);
    if (error) {
      console.log(
        "Download error (file probably not found or not accessible):",
        error.message || error
      );
    } else {
      console.log("Download succeeded. Size (bytes):", data.size ?? "unknown");
    }

    // getPublicUrl
    try {
      const publicUrlRes = supabase.storage.from(bucket).getPublicUrl(path);
      console.log("getPublicUrl ->", publicUrlRes);
    } catch (e) {
      console.warn("getPublicUrl error:", e.message || e);
    }

    // create signed URL (60s)
    try {
      const { data: signed, error: signedErr } = await supabase.storage
        .from(bucket)
        .createSignedUrl(path, 60);
      if (signedErr)
        console.log("createSignedUrl error:", signedErr.message || signedErr);
      else console.log("Signed URL (60s):", signed.signedUrl);
    } catch (e) {
      console.warn("createSignedUrl exception:", e.message || e);
    }

    return true;
  } catch (e) {
    console.error("Unexpected error checking file:", e);
    return false;
  }
}

(async () => {
  const [, , bucket, path] = process.argv;
  if (!bucket || !path) {
    console.error("Uso: node scripts/check-storage-file.js <bucket> <path>");
    process.exit(2);
  }
  const ok = await checkFile(bucket, path);
  process.exit(ok ? 0 : 3);
})();
