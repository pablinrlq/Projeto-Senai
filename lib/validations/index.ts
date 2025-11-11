// Validation schemas and helpers exports
export {
  UserSchema,
  CreateUserSchema,
  UpdateUserSchema,
  AtestadoSchema,
  CreateAtestadoSchema,
  UpdateAtestadoStatusSchema,
  LoginSchema,
  BrazilianDateSchema,
  AtestadoDateRangeSchema
} from './schemas';

export type {
  User,
  CreateUserData,
  UpdateUserData,
  Atestado,
  CreateAtestadoData,
  UpdateAtestadoStatus,
  LoginData
} from './schemas';

export {
  validateRequestBody,
  handleZodError,
  formatValidationErrors
} from './helpers';
