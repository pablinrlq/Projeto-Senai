#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");

function loadDotEnv(file = path.join(process.cwd(), ".env")) {
  if (!fs.existsSync(file)) return;
  const env = fs.readFileSync(file, "utf8");
  env.split(/\r?\n/).forEach((line) => {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!m) return;
    let [, key, val] = m;
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
    if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
    if (process.env[key] === undefined) process.env[key] = val;
  });
}

loadDotEnv();

const { createClient } = require("@supabase/supabase-js");
const argon2 = require("argon2");

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.error("Usage: node scripts/create-admin.js <email> <password>");
    process.exit(2);
  }
  const [email, password] = args;

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error(
      "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment"
    );
    process.exit(1);
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });

  try {
    console.log("Creating Supabase auth user for email:", email);
    const { data: createdUser, error: createUserError } =
      await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

    if (createUserError) {
      console.error("Error creating auth user:", createUserError);
      process.exit(1);
    }

    const userId = createdUser.user.id;
    console.log("Auth user created with id:", userId);

    let hashed;
    try {
      hashed = await argon2.hash(password);
    } catch (err) {
      console.error("Failed to hash password:", err);
    }

    const profile = {
      id: userId,
      nome: "Administrador",
      email,
      cargo: "ADMINISTRADOR",
      ra: null,
      senha: hashed || null,
      created_at: new Date().toISOString(),
    };

    const { error: insertErr } = await supabase
      .from("usuarios")
      .insert([profile])
      .select();
    if (insertErr) {
      console.error("Failed to insert perfil in usuarios:", insertErr);
      try {
        await supabase.auth.admin.deleteUser(userId);
      } catch (delErr) {
        console.error("Failed to rollback created auth user:", delErr);
      }
      process.exit(1);
    }

    console.log("Admin profile created in usuarios with id:", userId);
    console.log("Done. You can now login with the new admin account.");
  } catch (err) {
    console.error("Unexpected error:", err);
    process.exit(1);
  }
}

main();
