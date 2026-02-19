🚀 TaskFlow — Modern Task Management System

A powerful, full-stack task management application built with modern web technologies to help users stay organized and productive.

📌 Overview

TaskFlow is a full-stack web application designed for efficient task management and productivity tracking.
Built using the latest web technologies, it provides secure authentication, complete task CRUD operations, real-time dashboard statistics, and advanced filtering — all wrapped in a clean, responsive UI.

🛠️ Tech Stack
🎨 Frontend

Next.js 16

React 19

TypeScript

TailwindCSS

Radix UI

Lucide React

⚙️ Backend

Next.js API Routes

Drizzle ORM

🗄️ Database

PostgreSQL (Neon)

🔐 Authentication & Security

JWT (Access + Refresh Tokens)

bcrypt (Password Hashing)

🧪 Development Tools

ESLint

TypeScript

Drizzle Kit

✨ Key Features

✅ Secure user registration & login
✅ JWT-based authentication with refresh token strategy
✅ Create, edit, delete, and organize tasks
✅ Filter tasks by:

Status → Pending | In Progress | Completed

Priority → Low | Medium | High | Urgent
✅ Real-time dashboard statistics
✅ Responsive design
✅ Dark mode support
✅ Type-safe database operations

🧭 Application Routes
Route	Description
/	Landing page
/login	User login
/signup	Create new account
/dashboard	Main task management interface
🚀 Getting Started
1️⃣ Install Dependencies
npm install

2️⃣ Push Database Schema
npm run db:push

3️⃣ Start Development Server
npm run dev


App will run at:

http://localhost:3000

🧑‍💻 Development Commands
Command	Description
npm run dev	Start development server
npm run build	Create production build
npm run db:push	Push database schema
npm run seed:tasks	Add sample task data
🏗️ Architecture Highlights

🔒 Secure JWT authentication (Access + Refresh token pattern)

🧩 Component-based scalable architecture

🛡️ Password hashing using bcrypt

📦 Type-safe database queries with Drizzle ORM

🎯 Clean folder structure with separation of concerns

⚡ Optimized for performance and developer experience

🌙 UI & Experience

Minimal and modern interface

Fully responsive across devices

Dark mode support

Accessible UI components powered by Radix


It’s built not just as a project — but as a production-ready system.
