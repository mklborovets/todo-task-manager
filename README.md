# Full-Stack Task Manager (TODO Application)

A full-stack task management web application built with TypeScript, Express.js, Sequelize (PostgreSQL), React, and TanStack Query. The project is organized as a monorepo containing both the RESTful API backend and the single-page frontend client.

## Tech Stack

### Backend

- **Runtime & Framework:** Node.js, Express 5, TypeScript
- **Database & ORM:** PostgreSQL (Neon Serverless), Sequelize (`sequelize-typescript`)
- **Authentication & Security:** JSON Web Tokens (JWT), `bcrypt`, CORS
- **Validation:** Zod

### Frontend

- **Framework & Build Tool:** React 19, TypeScript, Vite
- **State Management & Data Fetching:** TanStack Query (React Query v5), Axios
- **Routing:** React Router v7
- **Styling & Icons:** Tailwind CSS v4, Lucide React

---

## Key Features

- **JWT Authentication:** User registration, login, and persistent session verification via protected routes.
- **Data Isolation:** Strict multi-tenant architecture where users can only view, create, update, and delete their own tasks.
- **Full Task CRUD:** Create tasks with an optional description, edit task details, switch statuses inline, and delete tasks.
- **Status Filtering:** Server-side filtering by task status (`todo`, `in_progress`, `done`) integrated with TanStack Query caching.
- **Input Validation & Error Handling:** Request body and query parameter validation using Zod schemas with centralized HTTP error handling.

---

## Project Structure

```text
todo-task-manager/
├── backend/
│   ├── src/
│   │   ├── common/
│   │   │   ├── errors/      # Custom AppError class
│   │   │   ├── middlewares/ # JWT auth, Zod validation, and error handler
│   │   │   └── types/       # Express request type declarations
│   │   ├── config/          # Environment variables and Sequelize DB setup
│   │   ├── modules/
│   │   │   ├── auth/        # Auth controller, service, schema, routes & User model
│   │   │   └── tasks/       # Tasks controller, service, schema, routes & Task model
│   │   ├── app.ts           # Express application configuration
│   │   └── server.ts        # Server entry point and database initialization
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── api/             # Axios instance and API methods
│   │   ├── components/      # Reusable UI components (TaskCard, Modal, Navbar) 
│   │   ├── context/         # Authentication React Context
│   │   ├── hooks/           # TanStack Query custom hooks
│   │   ├── pages/           # Dashboard, Login, and Register pages
│   │   ├── types/           # Shared TypeScript interfaces
│   │   ├── App.tsx          # React Router configuration
│   │   ├── index.css        # Tailwind CSS imports
│   │   └── main.tsx         # React application entry point
│   ├── .env.example
│   ├── package.json
│   └── vite.config.ts
│
├── .gitignore
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- PostgreSQL database instance (local or cloud, e.g., Neon / Supabase)

### 1. Clone the Repository

```bash
git clone https://github.com/mklborovets/todo-task-manager
cd todo-task-manager
```

### 2. Backend Configuration & Launch

Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory based on `.env.example`:

```env
PORT=4000
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
JWT_SECRET=your_secure_jwt_secret_key_min_16_chars
JWT_EXPIRES_IN=7d
```

Start the backend development server:

```bash
npm run dev
```

The API server will start at `http://localhost:4000` and automatically synchronize Sequelize models with the PostgreSQL database.

### 3. Frontend Configuration & Launch

Open a new terminal, navigate to the frontend directory, and install dependencies:

```bash
cd frontend
npm install
```

Create a `.env` file in the frontend directory based on `.env.example`:

```env
VITE_API_URL=http://localhost:4000/api
```

Start the Vite development server:

```bash
npm run dev
```

The client application will be available at `http://localhost:5173`.

---

## API Endpoints

**Base URL:** `http://localhost:4000/api`

### Authentication

| Method | Endpoint           | Access  | Description                              |
| ------ | ------------------ | ------- | ---------------------------------------- |
| POST   | `/auth/register` | Public  | Register a new user and return JWT token |
| POST   | `/auth/login`    | Public  | Authenticate user and return JWT token   |
| GET    | `/auth/me`       | Private | Get current authenticated user profile   |

**Request Body (`/auth/register` & `/auth/login`):**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Tasks

All task endpoints require the header `Authorization: Bearer <token>`.

| Method | Endpoint                      | Description                                                  |
| ------ | ----------------------------- | ------------------------------------------------------------ |
| GET    | `/tasks`                    | Get all tasks for current user                               |
| GET    | `/tasks?status=in_progress` | Filter tasks by status (`todo`, `in_progress`, `done`) |
| GET    | `/tasks/:id`                | Get a single task by ID                                      |
| POST   | `/tasks`                    | Create a new task                                            |
| PATCH  | `/tasks/:id`                | Update task title, description, or status                    |
| DELETE | `/tasks/:id`                | Delete a task (204 No Content)                               |

**Request Body (`POST /tasks`):**

```json
{
  "title": "Buy groceries for the week",
  "description": "Milk, eggs, chicken breast, pasta, and coffee",
  "status": "todo"
}
```

**Request Body (`PATCH /tasks/:id`):**

```json
{
  "title": "Buy groceries for the week",
  "description": "Updated list",
  "status": "done"
}
```

---

## Production Build

To verify TypeScript compilation and build production bundles for both parts of the monorepo:

```bash
# Build Backend
cd backend
npm run build
npm start

# Build Frontend
cd ../frontend
npm run build
npm run preview
```
