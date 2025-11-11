# Zod Validation Examples for Firebase API

## 🔍 **API Validation Examples**

### Creating a User

```typescript
// ✅ Valid request
const validUser = {
  nome: "João Silva",
  email: "joao@example.com",
  cargo: "FUNCIONARIO", // Must be: ADMINISTRADOR, USUARIO, or FUNCIONARIO
  telefone: "11999999999", // Optional
  ra: "123456789", // Must be at least 5 characters
  senha: "minhasenha123" // Must be at least 6 characters
};

const response = await fetch('/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(validUser)
});

// ❌ Invalid request examples
const invalidUser1 = {
  nome: "A", // Too short (minimum 2 characters)
  email: "invalid-email", // Invalid email format
  cargo: "INVALID_ROLE", // Invalid cargo
  ra: "123", // Too short (minimum 5 characters)
  senha: "123" // Too short (minimum 6 characters)
};

// Response will be:
{
  "error": "Dados inválidos",
  "details": [
    "nome: Nome deve ter pelo menos 2 caracteres",
    "email: Email deve ter um formato válido",
    "cargo: Cargo deve ser ADMINISTRADOR, USUARIO ou FUNCIONARIO",
    "ra: RA deve ter pelo menos 5 caracteres",
    "senha: Senha deve ter pelo menos 6 caracteres"
  ]
}
```

### Creating an Atestado

```typescript
// ✅ Valid request
const validAtestado = {
  id_usuario: "user_document_id",
  data_inicio: "3 de novembro de 2025 às 08:00:00 UTC-3",
  data_fim: "5 de novembro de 2025 às 18:00:00 UTC-3",
  motivo: "Consulta médica de rotina", // Minimum 5 characters
  imagem_atestado: "https://example.com/image.jpg", // Optional
  status: "pendente" // Optional, defaults to "pendente"
};

const response = await fetch('/api/atestados', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(validAtestado)
});
```

### Updating Atestado Status

```typescript
// ✅ Valid request
const updateStatus = {
  status: "aprovado" // Must be: pendente, aprovado, or rejeitado
};

const response = await fetch('/api/atestados?id=atestado_id', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(updateStatus)
});
```

### User Login

```typescript
// ✅ Valid request
const loginData = {
  email: "admin@example.com", // Must be valid email format
  senha: "password123" // Required
};

const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(loginData)
});

// Success response:
{
  "success": true,
  "message": "Login realizado com sucesso",
  "user": {
    "id": "user_id",
    "nome": "Admin User",
    "email": "admin@example.com",
    "cargo": "ADMINISTRADOR"
    // Note: senha is excluded from response
  },
  "token": "session_token"
}
```

## 📋 **Validation Rules Summary**

### User Validation
- **nome**: Minimum 2 characters
- **email**: Valid email format
- **cargo**: Must be "ADMINISTRADOR", "USUARIO", or "FUNCIONARIO"
- **telefone**: Optional string
- **ra**: Minimum 5 characters
- **senha**: Minimum 6 characters

### Atestado Validation
- **id_usuario**: Required string (must exist in database)
- **data_inicio**: Required Brazilian date format
- **data_fim**: Required Brazilian date format (must be after data_inicio)
- **motivo**: Minimum 5 characters
- **imagem_atestado**: Optional string (defaults to empty)
- **status**: Optional, must be "pendente", "aprovado", or "rejeitado" (defaults to "pendente")

### Login Validation
- **email**: Valid email format
- **senha**: Required string

## 🚀 **Client-Side Usage with React Hook Form**

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateUserSchema } from '@/lib/validations';

function CreateUserForm() {
  const form = useForm({
    resolver: zodResolver(CreateUserSchema),
    defaultValues: {
      nome: '',
      email: '',
      cargo: 'FUNCIONARIO',
      telefone: '',
      ra: '',
      senha: ''
    }
  });

  const onSubmit = async (data) => {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      const result = await response.json();
      console.log('User created:', result);
    } else {
      const error = await response.json();
      console.error('Validation errors:', error.details);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <input {...form.register('nome')} placeholder="Nome" />
      {form.formState.errors.nome && (
        <span>{form.formState.errors.nome.message}</span>
      )}
      
      <input {...form.register('email')} placeholder="Email" />
      {form.formState.errors.email && (
        <span>{form.formState.errors.email.message}</span>
      )}
      
      {/* Add other fields */}
      
      <button type="submit">Criar Usuário</button>
    </form>
  );
}
```

## 🛡️ **Benefits of Zod Validation**

1. **Type Safety**: Automatic TypeScript types from schemas
2. **Runtime Validation**: Validates data at runtime
3. **Consistent Errors**: Standardized error messages
4. **Client/Server Sync**: Same schemas for both sides
5. **Better UX**: Detailed error messages for users
6. **Security**: Prevents malformed data from reaching database
