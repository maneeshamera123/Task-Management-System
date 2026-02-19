TaskFlow - Modern Task Management System

Overview:
TaskFlow is a full-stack web application for efficient task management and productivity tracking. Built with Next.js 16, it provides user authentication, task CRUD operations, real-time statistics, and advanced filtering capabilities in a responsive, modern interface.

Tech & Tools:
Frontend: Next.js 16, React 19, TypeScript, TailwindCSS
Backend: Next.js API Routes, Drizzle ORM
Database: PostgreSQL (Neon)
Authentication: JWT with refresh tokens, bcrypt
UI Components: Radix UI, Lucide React
Development: ESLint, TypeScript, Drizzle Kit

Quick Guide:
Setup:
npm install
npm run db:push
npm run dev

Key Features:
User registration/login with secure authentication
Create, edit, delete, and organize tasks
Filter by status (pending/in-progress/completed) and priority (low/medium/high/urgent)
Real-time dashboard statistics
Responsive design with dark mode support

Navigation:
/ - Landing page
/login - User login
/signup - Create account
/dashboard - Main task management interface

Development Commands:
npm run dev - Start development server
npm run build - Production build
npm run db:push - Push database schema
npm run seed:tasks - Add sample data

The application follows modern web development best practices with type-safe database operations, secure authentication, and a component-based architecture.
