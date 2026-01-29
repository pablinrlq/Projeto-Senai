export type {
  User,
  CreateUserData,
  UpdateUserData,
  Atestado,
  CreateAtestadoData,
  UpdateAtestadoStatus,
  LoginData,
} from "@/lib/validations";

export interface FirebaseResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export type UserRole = "ADMINISTRADOR" | "USUARIO" | "FUNCIONARIO";
