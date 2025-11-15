import { NextResponse } from "next/server";
import { db } from "@/lib/firebase/admin";
import type { DB } from "@/lib/firebase/admin";

export function withFirebaseAdmin(
  handler: (req: Request, db: DB) => Promise<unknown>
): (req: Request) => Promise<NextResponse> {
  return async (req: Request) => {
    try {
      const result = await handler(req, db);
      return result as unknown as NextResponse;
    } catch (error) {
      console.error("🔥 Firebase Admin Error:", error);

      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  };
}

export async function safeFirestoreOperation<T>(
  operation: () => Promise<T>,
  errorMessage = "Database operation failed"
): Promise<{ data: T | null; error: string | null }> {
  try {
    const data = await operation();
    return { data, error: null };
  } catch (error) {
    console.error("⚠️ Firestore Operation Error:", error);
    return { data: null, error: errorMessage };
  }
}
