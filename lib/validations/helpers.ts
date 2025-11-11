import { NextResponse } from 'next/server';
import { ZodError, ZodSchema } from 'zod';

/**
 * Helper function to validate request body with Zod and return appropriate error response
 */
export function validateRequestBody<T>(
  schema: ZodSchema<T>,
  body: unknown
): { success: true; data: T } | { success: false; response: NextResponse } {
  const validationResult = schema.safeParse(body);

  if (!validationResult.success) {
    const errorMessages = validationResult.error.errors.map(
      (error) => `${error.path.join('.')}: ${error.message}`
    );

    return {
      success: false,
      response: NextResponse.json(
        {
          error: 'Dados inválidos',
          details: errorMessages
        },
        { status: 400 }
      )
    };
  }

  return {
    success: true,
    data: validationResult.data
  };
}

/**
 * Helper function to handle Zod errors in catch blocks
 */
export function handleZodError(error: unknown): NextResponse {
  if (error instanceof ZodError) {
    const errorMessages = error.errors.map(
      (err) => `${err.path.join('.')}: ${err.message}`
    );

    return NextResponse.json(
      {
        error: 'Dados inválidos',
        details: errorMessages
      },
      { status: 400 }
    );
  }

  console.error('Unexpected error:', error);
  return NextResponse.json(
    { error: 'Erro interno do servidor' },
    { status: 500 }
  );
}

/**
 * Helper function to format validation errors for client consumption
 */
export function formatValidationErrors(error: ZodError): {
  error: string;
  details: string[];
  fieldErrors: Record<string, string[]>;
} {
  const details = error.errors.map(
    (err) => `${err.path.join('.')}: ${err.message}`
  );

  const fieldErrors: Record<string, string[]> = {};
  error.errors.forEach((err) => {
    const field = err.path.join('.');
    if (!fieldErrors[field]) {
      fieldErrors[field] = [];
    }
    fieldErrors[field].push(err.message);
  });

  return {
    error: 'Dados inválidos',
    details,
    fieldErrors
  };
}
