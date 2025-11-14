import { NextResponse } from "next/server";
import { supabase } from "@/lib/firebase/admin";

export async function GET() {
  try {
    // Get counts using head=true + count=exact
    const { count: usuariosCount, error: uErr } = await supabase
      .from("usuarios")
      .select("*", { head: true, count: "exact" });

    if (uErr) throw uErr;

    const { count: atestadosCount, error: aErr } = await supabase
      .from("atestados")
      .select("*", { head: true, count: "exact" });

    if (aErr) throw aErr;

    return NextResponse.json({
      success: true,
      message: "Supabase connection successful",
      data: {
        timestamp: new Date().toISOString(),
        collections: {
          usuarios: usuariosCount ?? 0,
          atestados: atestadosCount ?? 0,
        },
      },
    });
  } catch (error: unknown) {
    console.error("Supabase connection test failed:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Supabase connection failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
