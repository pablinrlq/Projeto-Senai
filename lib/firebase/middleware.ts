import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase/admin";

export function withFirebaseAdmin(
  handler: (req: NextRequest, db: any) => Promise<any>
): (req: NextRequest) => Promise<NextResponse> {
  return async (req: NextRequest) => {
    try {
      return await handler(req, db);
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
