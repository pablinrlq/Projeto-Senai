# Route Organization Summary

## New Folder Structure

```
app/
├── (private)/                 # Protected routes group
│   ├── layout.tsx             # Authentication middleware
│   ├── dashboard/
│   │   └── page.tsx           # Main dashboard (all users)
│   ├── atestados/
│   │   └── page.tsx           # Medical certificates (all users)
│   ├── perfil/
│   │   └── page.tsx           # User profile (all users)
│   └── admin/                 # Admin-only section
│       ├── page.tsx           # Admin dashboard
│       └── usuarios/
│           └── page.tsx       # User management (admin only)
├── auth/
│   └── page.tsx               # Login page
├── api/                       # API routes
│   ├── auth/
│   ├── profile/
│   ├── atestados/
│   └── usuarios/
└── page.tsx                   # Root redirect
```

## Access Control

### Public Routes
- `/` - Redirects to appropriate dashboard based on user type
- `/auth` - Login page

### Protected Routes (require authentication)
- `/dashboard` - Main dashboard for all authenticated users
- `/atestados` - Medical certificates management
- `/perfil` - User profile page

### Admin-Only Routes (require admin role)
- `/admin` - Admin dashboard with management tools
- `/admin/usuarios` - User management and search

## Authentication Flow

1. **Root Page (`/`)**: Checks if user is logged in
   - Not logged in → Redirect to `/auth`
   - Logged in as admin → Redirect to `/admin`
   - Logged in as regular user → Redirect to `/dashboard`

2. **Login Page (`/auth`)**: After successful login
   - Admin users → Redirect to `/admin`
   - Regular users → Redirect to `/dashboard`

3. **Private Layout**: Middleware that runs for all routes in `(private)` folder
   - Validates authentication token
   - Checks admin access for `/admin/*` routes
   - Redirects unauthorized users appropriately

## User Types and Access

### Regular Users (aluno/professor)
- ✅ Dashboard
- ✅ Atestados (create and view own)
- ✅ Profile
- ❌ Admin panel
- ❌ User management

### Administrators
- ✅ Dashboard
- ✅ Atestados (view and manage all)
- ✅ Profile
- ✅ Admin panel
- ✅ User management
- ✅ Additional admin tools

## Key Features

- **Route Protection**: All private routes are protected by authentication middleware
- **Role-Based Access**: Admin routes are restricted to administrators only
- **Automatic Redirects**: Users are redirected to appropriate dashboards based on their role
- **Session Management**: Token validation and session cleanup
- **Error Handling**: Proper error messages and fallbacks for unauthorized access

## Navigation

### For Regular Users
- Dashboard → Atestados, Profile
- Clean and simple interface

### For Administrators
- Dashboard → Atestados, Admin Panel, Profile
- Admin Panel → User Management, Reports (coming soon), Settings (coming soon)
- Enhanced interface with administrative tools
