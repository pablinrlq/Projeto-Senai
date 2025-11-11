# Firebase Database Example

This example demonstrates a complete integration with Firebase using the organized project structure.

## Features Demonstrated

### 🔥 Firebase Integration
- **Client Configuration**: Secure client-side Firebase setup
- **Admin Configuration**: Server-side Firebase Admin SDK
- **Real-time Updates**: Live data synchronization with Firestore
- **Collection Management**: Proper collection references and queries

### 📊 Dashboard Components
- **Overview Stats**: Real-time counters and metrics
- **User Management**: Complete CRUD operations for users
- **Atestado Management**: Medical certificate workflow
- **Form Handling**: Validated forms with Zod schemas

### 🛡️ Data Validation
- **Zod Schemas**: Type-safe validation with Portuguese error messages
- **Firebase Rules**: Proper data structure enforcement
- **Input Sanitization**: Client and server-side validation

### 🎨 UI Components
- **Shadcn/ui**: Professional UI component library
- **Tables**: Data display with sorting and filtering
- **Forms**: Validated input forms with proper error handling
- **Toast Notifications**: User feedback with Sonner
- **Responsive Design**: Mobile-first responsive layout

## File Structure

```
app/dashboard/
├── layout.tsx          # Dashboard layout wrapper
└── page.tsx           # Main dashboard page

hooks/
└── use-firebase.ts    # Custom hooks for Firebase operations

lib/firebase/
├── client.ts          # Client-side Firebase config
├── admin.ts           # Server-side Firebase config
└── utils.ts           # Firebase utility functions

lib/validations/
├── schemas.ts         # Zod validation schemas
└── helpers.ts         # Validation helper functions
```

## Usage Examples

### Using Firebase Hooks

```tsx
import { useUsers, useAtestados } from '@/hooks/use-firebase';

function MyComponent() {
  const { users, loading, error, addUser } = useUsers();
  const { atestados, addAtestado } = useAtestados();

  // Add new user
  const handleAddUser = async (userData) => {
    const result = await addUser(userData);
    if (result.success) {
      console.log('User added successfully');
    }
  };

  return (
    <div>
      {users.map(user => (
        <div key={user.id}>{user.nome}</div>
      ))}
    </div>
  );
}
```

### Validation with Zod

```tsx
import { CreateUserSchema } from '@/lib/validations/schemas';

function validateUser(userData) {
  try {
    const validated = CreateUserSchema.parse(userData);
    return { success: true, data: validated };
  } catch (error) {
    return { success: false, errors: error.errors };
  }
}
```

## Data Structure

### Users Collection (`usuarios`)
```json
{
  "id": "auto-generated-id",
  "nome": "João Silva",
  "email": "joao@example.com",
  "cargo": "FUNCIONARIO",
  "telefone": "(11) 99999-9999",
  "ra": "123456789",
  "senha": "hashed-password",
  "data_criacao": "2025-11-03T10:00:00.000Z"
}
```

### Atestados Collection (`atestados`)
```json
{
  "id": "auto-generated-id",
  "id_usuario": "user-id-reference",
  "motivo": "Consulta médica de rotina",
  "data_inicio": "3 de novembro de 2025 às 08:00:00 UTC-3",
  "data_fim": "3 de novembro de 2025 às 18:00:00 UTC-3",
  "imagem_atestado": "optional-image-url",
  "status": "pendente",
  "data_criacao": "2025-11-03T10:00:00.000Z"
}
```

## Security Features

- ✅ Environment variable validation
- ✅ Firebase service account protection
- ✅ Input validation with Zod
- ✅ SQL injection prevention
- ✅ XSS protection
- ✅ Type safety with TypeScript

## Running the Example

1. **Start the development server**:
   ```bash
   bun dev
   ```

2. **Navigate to the dashboard**:
   - Visit: http://localhost:3000
   - Click "Acessar Dashboard"

3. **Test the features**:
   - View real-time user and atestado data
   - Create new users and atestados
   - See validation in action

## Next Steps

- Implement authentication flow
- Add file upload for atestado images
- Create admin approval workflow
- Add email notifications
- Implement search and filtering
- Add data export functionality

## Environment Setup

Make sure your `.env.local` file contains:

```env
# Firebase Client Config
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# Firebase Admin Config (keep private!)
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email
FIREBASE_PROJECT_ID=your-project-id
```

🔥 **Happy coding with Firebase!**
