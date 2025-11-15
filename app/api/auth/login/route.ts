import { NextRequest, NextResponse } from "next/server";
import { createSessionToken, supabase } from "@/lib/firebase/admin";
import { LoginSchema } from "@/lib/validations/schemas";
import { ZodError } from "zod";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const validationResult = LoginSchema.safeParse(body);

    if (!validationResult.success) {
      const errorMessages = validationResult.error.errors.map(
        (error) => `${error.path.join(".")}: ${error.message}`
      );

      return NextResponse.json(
        {
          error: "Dados inválidos",
          details: errorMessages,
        },
        { status: 400 }
      );
    }

    const validatedData = validationResult.data;

    console.table(validatedData);

    try {
      const credentials: { email: string; password: string } = {
        email: validatedData.email,
        password: validatedData.senha,
      };

      const { data: signInData, error: signInError } =
        await supabase.auth.signInWithPassword(credentials as any);

      if (signInError) {
        return NextResponse.json(
          { error: "Email ou senha incorretos" },
          { status: 401 }
        );
      }

      const userId = signInData?.user?.id;

      const { data: profile, error: profileError } = await supabase
        .from("usuarios")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (profileError) {
        console.error("Error fetching profile after sign-in:", profileError);
      }

      const token = await createSessionToken(userId);

      const safeProfile = profile
        ? { ...profile }
        : { id: userId, email: validatedData.email };
      if ((safeProfile as any).senha) delete (safeProfile as any).senha;

      return NextResponse.json({
        success: true,
        message: "Login realizado com sucesso",
        user: safeProfile,
        token,
        supabaseSession: signInData?.session ?? null,
      });
    } catch (err) {
      console.error("Error during Supabase signIn:", err);
      return NextResponse.json(
        { error: "Erro interno do servidor" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in login route:", error);
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: "Dados inválidos",
          details: error.errors.map((e) => `${e.path.join(".")}: ${e.message}`),
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
