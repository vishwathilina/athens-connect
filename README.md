# Athens Connect

Athens Connect is a comprehensive community platform built for NSBM Green University. It enables students to discover campus clubs, explore upcoming events, RSVP for activities, and gives club presidents and staff the tools they need to manage their organizations effectively.

## ✨ Features

- **Club Discovery & Memberships**: Browse through diverse campus clubs, read their stories, and join directly from the platform.
- **Event Management**:
  - **Students**: Discover upcoming events and RSVP to secure your spot.
  - **Club Presidents**: Dedicated dashboard to create, edit, and keep track of events hosted by your club.
- **Role-Based Access**: Specialized interfaces for Students, Club Staff, and Club Presidents, all protected by secure JWT authentication.
- **Modern UI/UX**: Built with seamless interaction in mind, utilizing beautiful aesthetics tailored to foster engagement.

## 🛠 Tech Stack

### Frontend
- **Framework**: React with Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS for utility-first styling
- **Components**: Shadcn UI 
- **Icons**: Lucide React
- **Routing**: React Router DOM (v6)
- **State Management/Data Fetching**: `@tanstack/react-query`

### Backend
- **Environment**: Node.js / Bun
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL (powered by Neon Serverless)
- **Authentication**: JWT token-based auth (`jose`) with bcrypt for secure password hashing
- **Validation**: Zod schema validation

## 🚀 Getting Started

Follow these steps to run Athens Connect locally.

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+) or [Bun](https://bun.sh/)
- PostgreSQL Database URL (e.g., Neon or local pg instance)

### 1. Clone the repository

```bash
git clone https://github.com/vishwathilina/athens-connect.git
cd athens-connect
```

### 2. Set up the Database

The database configuration script uses PostgreSQL. Ensure the required schema from `public/Database/DB.sql` is imported into your database instance to generate the necessary tables and RSVP functions.

### 3. Backend Setup

1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   bun install
   # or npm install
   ```
3. Create a `.env` file in the `backend/` directory and configure the environment variables:
   ```env
   PORT=3000
   DATABASE_URL=your_neon_postgresql_connection_string
   JWT_SECRET=your_super_secret_key
   ```
4. Start the backend development server:
   ```bash
   bun run dev
   # or npm run dev
   ```

### 4. Frontend Setup

1. Open a new terminal and navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   bun install
   # or npm install
   ```
3. Create a `.env` file in the `frontend/` directory connecting to the local backend:
   ```env
   VITE_API_URL=http://localhost:3000/api
   ```
4. Start the frontend development server:
   ```bash
   bun run dev
   # or npm run dev
   ```

## 🌐 Usage

By default, the Vite frontend will run at [http://localhost:5173](http://localhost:5173) (or `http://localhost:8080` if configured), and the Express backend will be running on [http://localhost:3000](http://localhost:3000).

- **Sign up/Log in** to your account.
- Select your role on the sign-up page (or get elevated to staff/president later by a system admin).
- Check the **Clubs** tab to find organizations.
- Keep track of **Upcoming Events** right from the homepage!

## 📜 License
This project is for educational and internal use by Team 8080. All rights reserved.
