import { NextResponse } from 'next/server';
import { withFirebaseAdmin, safeFirestoreOperation } from '@/lib/firebase/middleware';
import { CreateUserSchema } from '@/lib/validations/schemas';
import { validateRequestBody } from '@/lib/validations/helpers';
import * as argon2 from "argon2";

// POST /api/auth/signup - Student registration
export const POST = withFirebaseAdmin(async (req, db) => {
  try {
    const body = await req.json();

    // valida a requisição de criar a tabela de um usuario noco
    const validation = validateRequestBody(CreateUserSchema, body);
    if (!validation.success) {
      return validation.response;
    }

    const validatedData = validation.data;

    // ve se o usuario realmente existe
    const existingUserSnapshot = await db.collection('usuarios')
      .where('email', '==', validatedData.email)
      .limit(1)
      .get();

    if (!existingUserSnapshot.empty) {
      return NextResponse.json(
        { error: 'Usuário com este email já existe' },
        { status: 409 }
      );
    }

    // Ve se o RA existe
    const existingRASnapshot = await db.collection('usuarios')
      .where('ra', '==', validatedData.ra)
      .limit(1)
      .get();

    if (!existingRASnapshot.empty) {
      return NextResponse.json(
        { error: 'RA já está sendo usado por outro usuário' },
        { status: 409 }
      );
    }

    const { data, error } = await safeFirestoreOperation(async () => {
      const userData = {
        nome: validatedData.nome,
        email: validatedData.email,
        cargo: validatedData.cargo || 'USUARIO', // Default to USUARIO for student registration
        telefone: validatedData.telefone || '',
        ra: validatedData.ra,
        senha: await argon2.hash(validatedData.senha), // Botei "argon2.hash" pra concertar o erro
        // de que quando uma pessoa ia se cadastrar, ela tivesse o hask na senha
        
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      
        ...(body.metadata && { metadata: body.metadata })
      };

      const docRef = await db.collection('usuarios').add(userData);
      return { id: docRef.id, ...userData };
    }, 'Failed to create user');

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    // remove a responsabilidade da senha
    
    const { senha, ...userWithoutPassword } = data;

    return NextResponse.json({
      success: true,
      message: 'Conta criada com sucesso',
      data: userWithoutPassword
    }, { status: 201 });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
});
