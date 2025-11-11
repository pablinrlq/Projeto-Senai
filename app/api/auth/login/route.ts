import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser, createSessionToken } from '@/lib/firebase/admin';
import { LoginSchema } from '@/lib/validations/schemas';
import { ZodError } from 'zod';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate request body with Zod
    const validationResult = LoginSchema.safeParse(body);

    if (!validationResult.success) {
      const errorMessages = validationResult.error.errors.map(
        (error) => `${error.path.join('.')}: ${error.message}`
      );

      return NextResponse.json(
        {
          error: 'Dados inválidos',
          details: errorMessages
        },
        { status: 400 }
      );
    }

    const validatedData = validationResult.data;

    console.table(validatedData)

    // Authenticate user
    const authResult = await authenticateUser(validatedData);

    if (!authResult.success) {
      return NextResponse.json(
        { error: authResult.error },
        { status: 401 }
      );
    }

    // Create session token
    const token = await createSessionToken(authResult.user!.id);

    return NextResponse.json({
      success: true,
      message: 'Login realizado com sucesso',
      user: authResult.user,
      token
    });
  } catch (error) {
    console.error('Error in login route:', error);
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: 'Dados inválidos',
          details: error.errors.map(e => `${e.path.join('.')}: ${e.message}`)
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
