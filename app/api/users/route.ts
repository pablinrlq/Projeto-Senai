import { NextResponse } from "next/server";
import {
  withFirebaseAdmin,
  safeFirestoreOperation,
} from "@/lib/firebase/middleware";
import { CreateUserSchema } from "@/lib/validations/schemas";
import { validateRequestBody, handleZodError } from "@/lib/validations/helpers";

// GET /api/users - Fetch all users (server-side only)
export const GET = withFirebaseAdmin(async (req, db) => {
  const { data, error } = await safeFirestoreOperation(async () => {
    const snapshot = await db.collection("usuarios").get();
    return snapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data(),
    }));
  }, "Failed to fetch users");

  if (error) {
    return NextResponse.json({ success: false, error }, { status: 500 });
  }

  return NextResponse.json({ success: true, data });
});

// POST /api/users - Create a new user (server-side only)
export const POST = withFirebaseAdmin(async (req, db) => {
  try {
    const body = await req.json();

    // Validate request body with Zod
    const validation = validateRequestBody(CreateUserSchema, body);
    if (!validation.success) {
      return validation.response;
    }

    const validatedData = validation.data;

    // Check if user already exists
    const existingUserSnapshot = await db
      .collection("usuarios")
      .where("email", "==", validatedData.email)
      .limit(1)
      .get();

    if (!existingUserSnapshot.empty) {
      return NextResponse.json(
        { error: "Usuário com este email já existe" },
        { status: 409 }
      );
    }

    const { data, error } = await safeFirestoreOperation(async () => {
      const docRef = await db.collection("usuarios").add({
        nome: validatedData.nome,
        email: validatedData.email,
        cargo: validatedData.cargo,
        telefone: validatedData.telefone,
        ra: validatedData.ra,
        senha: validatedData.senha, // Note: In production, hash this password
        createdAt: new Date().toISOString(),
      });
      return { id: docRef.id };
    }, "Failed to create user");

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json(
      {
        success: true,
        message: "Usuário criado com sucesso",
        data,
      },
      { status: 201 }
    );
  } catch (error) {
    return handleZodError(error);
  }
});
