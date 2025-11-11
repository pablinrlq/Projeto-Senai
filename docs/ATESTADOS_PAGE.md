# Atestados Page

This page provides a complete interface for managing medical certificates (atestados) in the application.

## Features

### For Regular Users (USUARIO/FUNCIONARIO):
- **Submit New Atestados**: Form to create new medical certificates with:
  - Start and end dates
  - Optional file upload (images up to 10MB)
  - Optional reason/description
- **View Personal History**: List of all submitted atestados with status badges
- **Image Preview**: Click to view uploaded certificate images in full size

### For Administrators (ADMINISTRADOR):
- **Manage All Atestados**: View all submitted atestados from all users
- **Approve/Reject**: Action buttons to approve or reject pending atestados
- **User Information**: See who submitted each atestado with RA and name
- **Status Overview**: Count of pending atestados requiring attention

## Technical Implementation

### Authentication
- Uses JWT token-based authentication stored in localStorage
- Redirects to `/auth` if not authenticated
- Fetches current user information from `/api/users/me`

### File Upload
- Supports JPEG, PNG, WEBP images up to 10MB
- Automatically handles both Firebase Storage and public folder uploads
- Validates file types and sizes on client-side

### API Integration
- **GET /api/atestados** - Fetch atestados (filtered by user role)
- **POST /api/atestados** - Create new atestado with file upload
- **PATCH /api/atestados** - Update atestado status (admin only)
- **GET /api/users/me** - Get current user information

### UI Components
- Built with shadcn/ui components
- Responsive design with mobile support
- Loading states and error handling
- Toast notifications for user feedback

## File Structure

```
app/(private)/atestados/
├── page.tsx              # Main atestados page component
app/api/
├── atestados/route.ts    # Atestados API endpoints
├── users/me/route.ts     # Current user endpoint
```

## Usage

Navigate to `/atestados` after authentication to access the interface. The page automatically detects user role and shows appropriate functionality.
