# 🏥 Atestado Stock Hub

A modern, secure medical certificate management system built with Next.js, Firebase, and TypeScript.

## ✨ **Features**

- 🔐 **Secure Authentication** - Role-based access control (Admin, User, Employee)
- 📋 **Medical Certificate Management** - Create, approve, and track medical certificates
- ✅ **Input Validation** - Comprehensive Zod validation with Portuguese error messages
- 🔥 **Firebase Integration** - Real-time database with secure server/client separation
- 📱 **Responsive Design** - Modern UI with Tailwind CSS and Shadcn/ui
- 🛡️ **Type Safety** - Full TypeScript coverage with inferred types

## 🚀 **Quick Start**

### Prerequisites
- Node.js 18+ 
- Firebase project setup
- Environment variables configured

### Installation

```bash
# Install dependencies
bun install

# Set up environment variables
cp config/.env.example .env.local
# Edit .env.local with your Firebase credentials

# Run development server
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📚 **Documentation**

Comprehensive documentation is available in the [`/docs`](./docs/) folder:

- **[🏗️ Project Structure](./docs/PROJECT_STRUCTURE.md)** - Complete codebase organization
- **[🔒 Firebase Security](./docs/FIREBASE_SECURITY.md)** - Security implementation guide
- **[✅ Validation Guide](./docs/ZOD_VALIDATION_GUIDE.md)** - API validation examples

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
