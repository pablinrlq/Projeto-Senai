# Sign-up System Documentation

## Overview

This document describes the sign-up system implemented for the SENAI Stock Hub application. The system includes pages for student registration and admin user creation.

## Pages Created

### 1. Student Sign-up Page (`/auth/signup`)

**Location:** `/app/auth/signup/page.tsx`

**Purpose:** Allows students to register themselves in the system

**Features:**
- Student information collection (name, email, RA, phone, course, period)
- Password confirmation validation
- Automatic role assignment as 'USUARIO'
- Course and period selection dropdowns
- Responsive design with proper form validation

**Fields Required:**
- Nome Completo (Full Name) *
- RA (Student Registration Number) *
- Email *
- Telefone (Phone) *
- Curso (Course) *
- Período (Period) *
- Senha (Password) *
- Confirmar Senha (Confirm Password) *

**Available Courses:**
- Técnico em Informática
- Técnico em Eletrônica
- Técnico em Mecânica
- Técnico em Automação
- Técnico em Edificações
- Análise e Desenvolvimento de Sistemas
- Engenharia de Produção
- Outro

**Available Periods:**
- Matutino (Morning)
- Vespertino (Afternoon)
- Noturno (Evening)
- Integral (Full-time)

### 2. Admin User Creation Page (`/admin/create-user`)

**Location:** `/app/(private)/admin/create-user/page.tsx`

**Purpose:** Allows existing administrators to create new admin and staff users

**Features:**
- Admin-only access with authentication check
- Support for creating ADMINISTRADOR and FUNCIONARIO roles
- Department and access level assignment
- Comprehensive form validation
- Redirect protection for non-admin users

**Fields Required:**
- Nome Completo (Full Name) *
- RA/Matrícula (ID/Registration) *
- Email *
- Telefone (Phone) *
- Cargo (Role) * - ADMINISTRADOR or FUNCIONARIO
- Departamento (Department) *
- Nível de Acesso (Access Level) *
- Senha (Password) *
- Confirmar Senha (Confirm Password) *

**Available Departments:**
- Tecnologia da Informação
- Acadêmico
- Administrativo
- Recursos Humanos
- Financeiro
- Biblioteca
- Laboratório
- Coordenação
- Direção

**Available Access Levels:**
- Acesso Total
- Gestão
- Operacional
- Apenas Consulta

## API Endpoints

### 1. Student Registration API

**Endpoint:** `POST /api/auth/signup`

**Purpose:** Handles student registration

**Request Body:**
```json
{
  "nome": "string",
  "email": "string",
  "ra": "string",
  "telefone": "string",
  "senha": "string",
  "metadata": {
    "curso": "string",
    "periodo": "string"
  }
}
```

**Response:**
- Success: `201 Created` with user data (password excluded)
- Error: `409 Conflict` if email or RA already exists
- Error: `400 Bad Request` for validation errors

### 2. Admin User Creation API

**Endpoint:** `POST /api/admin/create-user`

**Purpose:** Allows admins to create new users

**Request Body:**
```json
{
  "nome": "string",
  "email": "string",
  "ra": "string",
  "telefone": "string",
  "cargo": "ADMINISTRADOR" | "FUNCIONARIO",
  "senha": "string",
  "metadata": {
    "departamento": "string",
    "nivel_acesso": "string"
  }
}
```

**Response:**
- Success: `201 Created` with user data (password excluded)
- Error: `409 Conflict` if email or RA already exists
- Error: `400 Bad Request` for validation errors

## Database Schema Updates

The user schema has been extended to support:
- `metadata` field for storing additional user information
- `createdBy` field for tracking who created admin users
- Enhanced validation for unique email and RA fields

## Navigation Integration

### Login Page Updates
- Added "Cadastrar como estudante" link to the login page
- Link directs to `/auth/signup`

### Dashboard Updates
- Added "Criar Usuário" card for admin dashboard
- Card navigates to `/admin/create-user`
- Only visible to users with ADMINISTRADOR role

## Security Considerations

1. **Authentication:** Admin creation page includes client-side auth checks
2. **Validation:** Both pages use Zod schema validation
3. **Unique Constraints:** Email and RA uniqueness enforced at API level
4. **Password Security:** Passwords should be hashed in production (currently stored as plain text)
5. **Role-based Access:** Admin creation restricted to ADMINISTRADOR role

## Usage Instructions

### For Students:
1. Go to the login page
2. Click "Cadastrar como estudante"
3. Fill out the registration form
4. Submit and return to login with new credentials

### For Administrators:
1. Login as an administrator
2. Go to dashboard
3. Click "Criar Usuário" card
4. Fill out the admin/staff creation form
5. Submit to create new user

## Future Enhancements

1. **Password Hashing:** Implement bcrypt or similar for password security
2. **JWT Authentication:** Replace simple token system with proper JWT
3. **Email Verification:** Add email verification for new registrations
4. **Bulk User Import:** Allow CSV import for multiple user creation
5. **User Profile Pictures:** Add avatar upload functionality
6. **Audit Logging:** Track user creation and modification activities
