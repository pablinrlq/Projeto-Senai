import * as jwt from "jsonwebtoken";

type AuthResult =
  | {
      success: true;
      uid: string;
      email?: string;
    }
  | {
      success: false;
      error: string;
      status: number;
    };

export async function verifyAuth(request: Request): Promise<AuthResult> {
  const authHeader = request.headers.get("authorization");

  console.log("Authorization Header:", authHeader);

  if (!authHeader?.startsWith("Bearer ")) {
    return {
      success: false,
      error: "Authorization header missing or malformed",
      status: 401,
    };
  }

  const token = authHeader.split("Bearer ")[1];

  try {
    const jwtSecret = process.env.JWT_SECRET || "your-jwt-secret-key";

    const decodedToken = jwt.verify(token, jwtSecret, {
      issuer: "atestado-stock-app",
      audience: "atestado-stock-users",
    }) as jwt.JwtPayload;

    return {
      success: true,
      uid: decodedToken.uid as string,
      email: decodedToken.email as string | undefined,
    };
  } catch (e) {
    console.error("Token verification error:", e);
    return { success: false, error: "Invalid token", status: 401 };
  }
}
