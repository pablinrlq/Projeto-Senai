#!/usr/bin/env node
const fs = require("fs");
const { createClient } = require("@supabase/supabase-js");

// naive .env parser (fallback when dotenv is not installed)
const envContent = fs.existsSync(".env") ? fs.readFileSync(".env", "utf8") : "";
const env = {};
envContent.split(/\r?\n/).forEach((line) => {
  const m = line.match(/^\s*([^#=\s]+)=(.*)$/);
  if (m) {
    let val = m[2].trim();
    // remove surrounding quotes
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    env[m[1]] = val;
  }
});

const SUPABASE_URL = env.SUPABASE_URL || process.env.SUPABASE_URL;
const SERVICE_KEY =
  env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false },
});

async function run() {
  try {
    console.log("Testing from(usuarios) select...");
    const { data, error } = await supabase
      .from("usuarios")
      .select("id")
      .limit(1);
    if (error) {
      console.error("Error from select:", error);
    } else {
      console.log(
        "Select OK, data length:",
        Array.isArray(data) ? data.length : 0
      );
    }

    // Try admin auth create user (this will create a user - commented out by default)
    // const { data: created, error: createErr } = await supabase.auth.admin.createUser({
    //   email: 'apitest-script@example.com',
    //   password: 'Test12345!'
    // });
    // if (createErr) console.error('createUser error:', createErr);
    // else console.log('Created user:', created);

    console.log("Testing storage list buckets...");
    const { data: buckets, error: bucketsErr } =
      await supabase.storage.listBuckets();
    if (bucketsErr) console.error("Buckets error:", bucketsErr);
    else console.log("Buckets:", buckets?.length);
  } catch (err) {
    console.error("Unexpected error:", err);
  }
}

run();
