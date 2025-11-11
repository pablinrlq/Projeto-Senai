# 🗂️ Project Structure - Atestado Stock Hub

## 📁 **Organized Folder Structure**

```
atestado-stock/
├── 📁 app/                          # Next.js App Router
│   ├── 📁 api/                      # API Routes
│   │   ├── 📁 auth/                 # Authentication endpoints
│   │   │   └── 📁 login/            # Login endpoint
│   │   ├── 📁 atestados/            # Medical certificates CRUD
│   │   └── 📁 users/                # Users management
│   ├── 📁 (private)/                # Protected routes
│   └── 📄 layout.tsx                # Root layout
│
├── 📁 components/                   # Reusable UI components
│   ├── 📁 ui/                       # Shadcn/ui components
│   ├── 📄 Logo.tsx                  # Brand logo
│   └── 📄 ProtectedRoute.tsx        # Route protection
│
├── 📁 hooks/                        # Custom React hooks
│   ├── 📄 use-firebase.ts           # Firebase data hooks
│   ├── 📄 use-mobile.tsx            # Mobile detection
│   └── 📄 use-toast.ts              # Toast notifications
│
├── 📁 lib/                          # Core utilities & configurations
│   ├── 📁 firebase/                 # Firebase services (organized)
│   │   ├── 📄 admin.ts              # Server-side Firebase config
│   │   ├── 📄 auth.ts               # Authentication utilities
│   │   ├── 📄 client.ts             # Client-side Firebase config
│   │   ├── 📄 middleware.ts         # API middleware helpers
│   │   ├── 📄 utils.ts              # Firebase utility functions
│   │   └── 📄 index.ts              # Firebase exports
│   │
│   ├── 📁 validations/              # Zod schemas & validation
│   │   ├── 📄 schemas.ts            # All Zod validation schemas
│   │   ├── 📄 helpers.ts            # Validation helper functions
│   │   └── 📄 index.ts              # Validation exports
│   │
│   ├── 📄 utils.ts                  # General utility functions
│   └── 📄 index.ts                  # Main lib exports
│
├── 📁 types/                        # TypeScript type definitions
│   ├── 📄 firebase.ts               # Firebase-related types
│   └── 📄 styles.d.ts               # Style-related types
│
├── 📁 config/                       # Configuration files
│   ├── 📄 .env.example              # Environment variables template
│   └── 📄 senai-*.json              # Firebase service account (gitignored)
│
├── 📁 docs/                         # Documentation
│   ├── 📄 FIREBASE_SECURITY.md      # Firebase security guide
│   ├── 📄 ZOD_VALIDATION_GUIDE.md   # Validation examples
│   └── 📄 PROJECT_STRUCTURE.md      # This file
│
├── 📁 public/                       # Static assets
│   ├── 📄 favicon.ico               # App icon
│   └── 📄 placeholder.svg           # Placeholder images
│
└── 📄 Configuration Files
    ├── 📄 package.json              # Dependencies & scripts
    ├── 📄 tsconfig.json             # TypeScript configuration
    ├── 📄 tailwind.config.ts        # Tailwind CSS config
    ├── 📄 next.config.ts            # Next.js configuration
    └── 📄 .gitignore                # Git ignore rules
```

## 🎯 **Key Architectural Decisions**

### **1. Firebase Organization (`lib/firebase/`)**
- **`admin.ts`**: Server-side Firebase Admin SDK configuration
- **`client.ts`**: Client-side Firebase configuration for browser
- **`auth.ts`**: Authentication utilities (login, session management)
- **`middleware.ts`**: API route middleware for secure operations
- **`utils.ts`**: Firebase-specific utility functions (date formatting, etc.)

### **2. Validation System (`lib/validations/`)**
- **`schemas.ts`**: All Zod validation schemas with Portuguese error messages
- **`helpers.ts`**: Validation helper functions for consistent error handling
- **Centralized validation**: Same schemas used on client and server

### **3. API Structure (`app/api/`)**
- **RESTful design**: Proper HTTP methods (GET, POST, PATCH)
- **Consistent error handling**: Standardized error responses
- **Type-safe validation**: Zod schemas validate all inputs
- **Security middleware**: Authentication and authorization layers

### **4. Type Safety (`types/`)**
- **Generated types**: Types inferred from Zod schemas
- **Backward compatibility**: Re-exports for existing code
- **Comprehensive coverage**: All Firebase operations typed

## 🔧 **Import Patterns**

### **Recommended Imports**

```typescript
// Firebase operations
import { withFirebaseAdmin, safeFirestoreOperation } from '@/lib/firebase/middleware';
import { usersCollection, atestadosCollection } from '@/lib/firebase/client';
import { authenticateUser, createSessionToken } from '@/lib/firebase/auth';

// Validation
import { CreateUserSchema, CreateAtestadoSchema } from '@/lib/validations/schemas';
import { validateRequestBody, handleZodError } from '@/lib/validations/helpers';

// Types
import { User, Atestado, CreateUserData } from '@/types/firebase';
```

### **Folder-Specific Imports**

```typescript
// For API routes (server-side)
import { withFirebaseAdmin } from '@/lib/firebase/middleware';
import { CreateUserSchema } from '@/lib/validations/schemas';

// For React components (client-side)
import { usersCollection } from '@/lib/firebase/client';
import { User } from '@/types/firebase';

// For hooks
import { CreateUserData, FirebaseResult } from '@/types/firebase';
```

## 📋 **File Responsibilities**

### **Firebase Files**
| File                     | Purpose                     | Usage                       |
| ------------------------ | --------------------------- | --------------------------- |
| `firebase/admin.ts`      | Server-side Firebase config | API routes only             |
| `firebase/client.ts`     | Client-side Firebase config | React components, hooks     |
| `firebase/auth.ts`       | Authentication logic        | Login, session management   |
| `firebase/middleware.ts` | API security helpers        | API route protection        |
| `firebase/utils.ts`      | Firebase utilities          | Date formatting, validation |

### **Validation Files**
| File                     | Purpose                | Usage            |
| ------------------------ | ---------------------- | ---------------- |
| `validations/schemas.ts` | Zod validation schemas | Input validation |
| `validations/helpers.ts` | Validation utilities   | Error handling   |

### **API Files**
| Endpoint          | Purpose              | Methods          |
| ----------------- | -------------------- | ---------------- |
| `/api/users`      | User management      | GET, POST        |
| `/api/atestados`  | Medical certificates | GET, POST, PATCH |
| `/api/auth/login` | Authentication       | POST             |

## 🛡️ **Security Features**

- ✅ **Input validation** with Zod schemas
- ✅ **Authentication middleware** for protected routes  
- ✅ **Environment variable validation**
- ✅ **Secure Firebase configuration**
- ✅ **Error handling** without information leakage
- ✅ **Type safety** throughout the application

## 🚀 **Development Workflow**

1. **Add new features**: Start with types and validation schemas
2. **API development**: Use middleware and validation helpers
3. **Client development**: Use typed hooks and components
4. **Testing**: Leverage TypeScript for compile-time checks
5. **Documentation**: Update relevant docs in `/docs` folder

## 📈 **Benefits of This Structure**

- **Maintainable**: Clear separation of concerns
- **Scalable**: Easy to add new features
- **Type-safe**: Comprehensive TypeScript coverage
- **Secure**: Built-in authentication and validation
- **Consistent**: Standardized patterns throughout
- **Documented**: Clear guidelines and examples
