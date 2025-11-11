# Firebase Security Configuration for Next.js

## 🔒 Security Best Practices Implementation

This document outlines the secure implementation of Firebase in your Next.js application.

### ⚠️ URGENT: Remove Exposed Credentials

**IMMEDIATELY** do the following:

1. **Regenerate your Firebase service account key**:
   - Go to Firebase Console → Project Settings → Service Accounts
   - Delete the current service account key
   - Generate a new one

2. **Remove sensitive files from git history**:
   ```bash
   git filter-branch --force --index-filter 'git rm --cached --ignore-unmatch .env senai-6f084-firebase-adminsdk-fbsvc-fa6da2210b.json' --prune-empty --tag-name-filter cat -- --all
   git push origin --force --all
   ```

3. **Set up proper environment variables**:
   - Use `.env.local` for local development (automatically ignored by Next.js)
   - Use your hosting platform's environment variable settings for production

### 🛡️ Secure Configuration

#### Client-Side Firebase (firebase.browser.ts)
Your current setup is correct. The `NEXT_PUBLIC_*` variables are safe to expose as they're meant for client-side use.

#### Server-Side Firebase (firebase.admin.ts)
The current implementation is secure in structure but needs proper environment handling.

### 📝 How to Use Securely

#### 1. Client-Side Operations (React Hooks)
```typescript
import { useUsers, useAtestados } from '@/hooks/use-firebase'

function Dashboard() {
  const { users, loading, error, addUser } = useUsers()
  const { atestados } = useAtestados()

  const handleAddUser = async () => {
    const result = await addUser({
      nome: 'João Silva',
      email: 'joao@example.com',
      cargo: 'FUNCIONARIO',
      telefone: '11999999999',
      ra: '123456789',
      senha: 'senhaSegura123'
    })
    
    if (result.success) {
      console.log('Usuário adicionado com sucesso')
    }
  }

  return (
    <div>
      {users.map(user => (
        <div key={user.id}>{user.nome} - {user.cargo}</div>
      ))}
    </div>
  )
}
```

#### 2. Server-Side Operations (API Routes)
```typescript
import { withFirebaseAdmin } from '@/lib/firebase.middleware'

// GET /api/users
export const GET = withFirebaseAdmin(async (req, db) => {
  const snapshot = await db.collection('usuarios').get()
  const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  return NextResponse.json({ users })
})

// GET /api/atestados?userId=123&status=pendente
export const GET = withFirebaseAdmin(async (req, db) => {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')
  const status = searchParams.get('status')
  
  let query = db.collection('atestados')
  if (userId) query = query.where('id_usuario', '==', userId)
  if (status) query = query.where('status', '==', status)
  
  const snapshot = await query.get()
  const atestados = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  return NextResponse.json({ atestados })
})
```

#### 3. Authentication
```typescript
// Login
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@email.com',
    senha: 'password123'
  })
})

const { user, token } = await response.json()

// Use token in subsequent requests
const authResponse = await fetch('/api/users', {
  headers: { 'Authorization': `Bearer ${token}` }
})
```

### 🔐 Environment Setup

#### Development (.env.local)
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your_project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour_Private_Key_Here\n-----END PRIVATE KEY-----"
```

#### Production (Vercel/Netlify/etc.)
Set these in your hosting platform's environment variables dashboard.

### 🚫 Never Do This
- ❌ Commit `.env` files
- ❌ Commit service account JSON files
- ❌ Use admin SDK on the client side
- ❌ Expose private keys in client code

### ✅ Security Checklist
- [x] Client config uses `NEXT_PUBLIC_*` variables
- [x] Admin config uses private environment variables
- [x] Service account JSON is not committed
- [x] Proper `.gitignore` rules are in place
- [ ] Regenerate compromised credentials
- [ ] Set up Firebase Security Rules
- [ ] Implement authentication
- [ ] Add API rate limiting
