// Re-export types from validations for backward compatibility
export type {
  User,
  CreateUserData,
  UpdateUserData,
  Atestado,
  CreateAtestadoData,
  UpdateAtestadoStatus,
  LoginData
} from '@/lib/validations';

// Firebase operation results
export interface FirebaseResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

// Additional types for authentication and user roles
export type UserRole = 'ADMINISTRADOR' | 'USUARIO' | 'FUNCIONARIO';
