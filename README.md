# 📸 Instagram Feed & Profile Clone (Fullstack Monorepo)

> 🏆 **Developer Club Challenge Edition**: A production-grade, type-safe fullstack Instagram Feed & Profile clone. Features a ready-to-use, 100% test-covered Express 5 + Prisma + PostgreSQL REST API with **Interactive Scalar API Documentation**, alongside starter client workspaces for Web (React 19 + TanStack Router) and Mobile (React Native + Expo Router).

---

## 📚 Table of Contents

- [✨ Project Overview & Challenge Goals](#-project-overview--challenge-goals)
- [🏗️ Monorepo Architecture](#️-monorepo-architecture)
- [⚡ Tech Stack](#-tech-stack)
- [🚀 Beginner-Friendly Quick Start Guide](#-beginner-friendly-quick-start-guide)
  - [Step 1: Install Required Tools](#step-1-install-required-tools)
  - [Step 2: Clone & Install Dependencies](#step-2-clone--install-dependencies)
  - [Step 3: Setup Environment Variables](#step-3-setup-environment-variables)
  - [Step 4: Start PostgreSQL Database](#step-4-start-postgresql-database)
  - [Step 5: Initialize Database Schema](#step-5-initialize-database-schema)
  - [Step 6: Verify Setup with Automated Tests](#step-6-verify-setup-with-automated-tests)
  - [Step 7: Start Development Servers](#step-7-start-development-servers)
- [📖 Interactive Scalar API Reference (How to Test APIs)](#-interactive-scalar-api-reference-how-to-test-apis)
- [🗄️ Visual Database Management (Prisma Studio)](#️-visual-database-management-prisma-studio)
- [📡 Complete API Endpoints Reference](#-complete-api-endpoints-reference)
- [💎 Frontend Production Architecture & Coding Style Guide](#-frontend-production-architecture--coding-style-guide)
  - [1. Centralized HTTP Client & 401 Refresh Interceptor (`lib/http-client.ts`)](#1-centralized-http-client--401-refresh-interceptor-libhttp-clientts)
  - [2. API Service Layer (`services/auth.api.ts`)](#2-api-service-layer-servicesauthapits)
  - [3. Zustand Persistent Auth Store (`stores/auth.store.ts`)](#3-zustand-persistent-auth-store-storesauthstorets)
  - [4. TanStack Query Custom Hooks (`hooks/api/use-auth.ts`)](#4-tanstack-query-custom-hooks-hooksapiuse-authts)
  - [5. Production Form Integration with React Hook Form & Zod](#5-production-form-integration-with-react-hook-form--zod)
- [🛠️ Monorepo Commands Cheat Sheet](#️-monorepo-commands-cheat-sheet)
- [❓ Beginner Troubleshooting & FAQ](#-beginner-troubleshooting--faq)
- [🤝 Contributing & Submitting Solutions](#-contributing--submitting-solutions)

---

## ✨ Project Overview & Challenge Goals

Welcome to the **Developer Club Challenge**! 

The backend API is **100% built, type-safe, validated with Zod, documented with Scalar, and covered with automated E2E tests**. Your goal as frontend/fullstack developers is to build the user interface:

- **What's already done**: 
  - Complete Authentication (Register, Login, Token Refresh, Logout, Password updates).
  - User Profiles (Profile info, Bios, Avatars, Followers/Following lists, User search).
  - Posts (Multi-image posts, Captions, Location, Delete).
  - Home & Explore Feeds (Chronological feed from followed creators + global discovery feed).
  - Likes & Comments (Instant like/unlike, Comment threads, Delete comments).
  - Live Interactive Documentation via Scalar at `http://localhost:3000/api/docs`.
- **Your Challenge**:
  - Connect your client application (`apps/web` for Web or `apps/native` for Mobile) to the backend API.
  - Follow our **Production Frontend Architecture** (Axios Interceptors, Refresh Queues, Zustand, TanStack Query).
  - Build responsive, beautiful UI screens matching Instagram's design patterns.

---

## 🏗️ Monorepo Architecture

```
instgarm_feed/
├── apps/
│   ├── server/          # Express 5 + Bun + Prisma REST API & Scalar Docs
│   │   ├── src/
│   │   │   ├── routes/          # Declarative routes with OpenAPI metadata
│   │   │   ├── controllers/     # HTTP request handlers
│   │   │   ├── services/        # Business logic & Prisma database operations
│   │   │   ├── middlewares/     # Auth (JWT) & Validation middlewares
│   │   │   ├── validations/     # Zod request/response validation schemas
│   │   │   ├── utils/           # Route builder, JWT, API response utilities
│   │   │   └── lib/             # OpenAPI registry, Prisma client, Pino logger
│   │   └── tests/               # 100% passing E2E Vitest + Supertest suites
│   ├── web/             # Web App (React 19 + TanStack Router + Tailwind + shadcn/ui)
│   └── native/          # Mobile App (React Native + Expo Router + NativeWind)
├── packages/
│   ├── db/              # Prisma schema & PostgreSQL database client
│   ├── env/             # Shared runtime environment variable validation (Zod)
│   └── config/          # Shared TypeScript configurations
└── .github/
    └── pull_request_template.md  # Standardized challenge submission PR template
```

---

## ⚡ Tech Stack

### 🚀 Backend (`apps/server`)
- **Runtime**: [Bun](https://bun.sh) (Ultra-fast JavaScript & TypeScript runtime)
- **Web Framework**: [Express 5](https://expressjs.com)
- **Database & ORM**: [PostgreSQL 16](https://www.postgresql.org) with [Prisma ORM](https://www.prisma.io)
- **Validation**: [Zod](https://zod.dev) with [@asteasolutions/zod-to-openapi](https://github.com/asteasolutions/zod-to-openapi)
- **Interactive Documentation**: [Scalar API Reference](https://scalar.com) (`/api/docs`) & OpenAPI 3.0
- **Authentication**: JWT (Access Tokens + Database-persisted Refresh Token sessions with revocation)
- **Testing**: [Vitest](https://vitest.dev) + [Supertest](https://github.com/ladjs/supertest)
- **Logging**: [Pino](https://github.com/pinojs/pino)

### 💻 Frontend Web (`apps/web`)
- **Framework**: [React 19](https://react.dev) + [TanStack Router](https://tanstack.com/router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com)
- **Data Fetching & State**: [TanStack Query](https://tanstack.com/query) + [Zustand](https://github.com/pmndrs/zustand)
- **HTTP Client**: [Axios](https://axios-http.com) with automatic JWT refresh interceptors

### 📱 Mobile (`apps/native`)
- **Framework**: [React Native](https://reactnative.dev) + [Expo](https://expo.dev)
- **Navigation**: [Expo Router](https://docs.expo.dev/router/introduction/)

---

## 🚀 Beginner-Friendly Quick Start Guide

Follow these step-by-step instructions to get your local development environment up and running in under 5 minutes.

### Step 1: Install Required Tools

Before starting, make sure you have the following installed on your computer:

1. **Bun** (v1.2 or higher):
   - **macOS / Linux**:
     ```bash
     curl -fsSL https://bun.sh/install | bash
     ```
   - **Windows (PowerShell)**:
     ```powershell
     powershell -c "irm bun.sh/install.ps1 | iex"
     ```
   - Verify installation: `bun --version`

2. **Docker Desktop** (Recommended for easiest database setup):
   - Download & install [Docker Desktop](https://www.docker.com/products/docker-desktop/).
   - Start Docker Desktop so the Docker daemon is running.
   - *Note: If you already have PostgreSQL installed locally, you can use that instead!*

3. **Git**:
   - [Download Git](https://git-scm.com/downloads) if you don't already have it.

---

### Step 2: Clone & Install Dependencies

Open your terminal, clone the repository, and install workspace dependencies:

```bash
# 1. Clone the repository
git clone <repository-url>
cd instgarm_feed

# 2. Install all dependencies across the entire monorepo
bun install
```

> 💡 **What is a monorepo?** A monorepo houses multiple related apps (backend, web frontend, mobile app) and shared packages (database schema) in a single repository. `bun install` automatically installs and links all of them at once!

---

### Step 3: Setup Environment Variables

Copy the example environment file to create your local `.env`:

```bash
cp .env.example .env
```

If `cp` is not available on Windows PowerShell, run:
```powershell
Copy-Item .env.example .env
```

Here is what `.env` contains:
```env
# PostgreSQL Database Connection String
DATABASE_URL="postgresql://postgres:password@localhost:5432/instgarm_feed?schema=public"

# Express Server Port & Mode
PORT=3000
NODE_ENV="development"
LOG_LEVEL="info"

# Allowed CORS Origins (Web frontend runs at http://localhost:5173 by default)
CORS_ORIGIN="http://localhost:5173"

# JWT Authentication Secrets
JWT_SECRET="instagram-feed-dev-club-jwt-secret-key-2026-super-secure"
JWT_REFRESH_SECRET="instagram-feed-dev-club-jwt-refresh-secret-key-2026-super-secure"
JWT_EXPIRES_IN="1d"
JWT_REFRESH_EXPIRES_IN="7d"
```

---

### Step 4: Start PostgreSQL Database

You can run PostgreSQL effortlessly using the included Docker Compose configuration:

```bash
# Start PostgreSQL container in background
bun run db:start
```

*(To stop the database later when you are done coding: `bun run db:stop`)*

> 🛠️ **Using Local PostgreSQL without Docker?**
> If you have PostgreSQL installed natively on your machine, create a database named `instgarm_feed` and update the `DATABASE_URL` in `.env` with your PostgreSQL username and password (e.g., `postgresql://postgres:YOUR_PASSWORD@localhost:5432/instgarm_feed?schema=public`).

---

### Step 5: Initialize Database Schema

Now push the Prisma database schema to your PostgreSQL database and generate the Prisma Client:

```bash
# 1. Generate Prisma Client TypeScript types
bun run db:generate

# 2. Push tables and relations to PostgreSQL
bun run db:push
```

You should see output indicating that all tables (`User`, `RefreshToken`, `Follow`, `Post`, `Like`, `Comment`) were created successfully.

---

### Step 6: Verify Setup with Automated Tests

Run the comprehensive test suite to verify that your database and backend are functioning 100% properly:

```bash
bun test
```

You should see **all test suites pass**:
```
✓ tests/auth.e2e.test.ts (7 tests)
✓ tests/user.e2e.test.ts (7 tests)
✓ tests/post.e2e.test.ts (4 tests)
✓ tests/feed.e2e.test.ts (3 tests)
✓ tests/like.e2e.test.ts (5 tests)
✓ tests/comment.e2e.test.ts (5 tests)
✓ tests/docs.e2e.test.ts (2 tests)

Test Files  7 passed (7)
     Tests  33 passed (33)
```

---

### Step 7: Start Development Servers

You can start development servers depending on what you are working on:

#### Option A: Start Backend Server Only (Recommended first step)
```bash
bun run dev:server
```
- 🌐 Express REST API will start at: `http://localhost:3000`
- 📖 Interactive **Scalar API Docs** will open at: `http://localhost:3000/api/docs`

#### Option B: Start Web Frontend
In another terminal tab:
```bash
bun run dev:web
```
- 💻 Web Application will run at: `http://localhost:5173`

#### Option C: Start Mobile App (Expo)
In another terminal tab:
```bash
bun run dev:native
```
- 📱 Press `a` for Android Emulator, `i` for iOS Simulator, or scan the QR code with the **Expo Go** app on your phone!

#### Option D: Start Everything Together
```bash
bun dev
```

---

## 📖 Interactive Scalar API Reference (How to Test APIs)

The backend provides a modern, interactive **Scalar API Playground**. You don't need Postman or Insomnia—you can test every API directly from your browser!

### Accessing the Docs
1. Start the server (`bun run dev:server`).
2. Open your browser and navigate to: **[http://localhost:3000/api/docs](http://localhost:3000/api/docs)**
3. Raw OpenAPI JSON is available at: **[http://localhost:3000/api/docs/openapi.json](http://localhost:3000/api/docs/openapi.json)**

### How to Authenticate & Test Protected Routes in Scalar:

1. **Register a User**:
   - In Scalar, find `POST /api/v1/auth/register`.
   - Click **Test Request**.
   - Send a request body:
     ```json
     {
       "email": "developer@example.com",
       "username": "coder123",
       "password": "Password123!",
       "fullName": "Junior Developer"
     }
     ```
   - Click **Send**. You will receive an `accessToken` and `refreshToken`.

2. **Authorize Scalar UI**:
   - Copy the `accessToken` from the response JSON.
   - At the top of the Scalar UI, click the **Authorize / Authentication** button (or Bearer token input).
   - Paste your `accessToken`.
   - Now, all protected routes (`POST /api/v1/posts`, `GET /api/v1/feed`, etc.) will automatically include your Bearer token!

3. **Try Creating a Post**:
   - Go to `POST /api/v1/posts`.
   - Send:
     ```json
     {
       "caption": "My first Instagram clone post! 🚀",
       "mediaUrls": ["https://picsum.photos/800/800"],
       "location": "San Francisco, CA"
     }
     ```
   - Hit **Send** and see your post created instantly in PostgreSQL!

---

## 🗄️ Visual Database Management (Prisma Studio)

Prisma Studio is a visual database browser built right into the project. It allows you to view, filter, create, and delete database records in a spreadsheet-like interface.

To launch Prisma Studio:

```bash
bun run db:studio
```

Open **[http://localhost:5555](http://localhost:5555)** in your browser. You can click on any table (`User`, `Post`, `Follow`, `Like`, `Comment`) to see live data.

---

## 📡 Complete API Endpoints Reference

All endpoints are prefixed with `/api/v1`.

### 🔐 Authentication (`/api/v1/auth`)

| Method | Endpoint | Auth | Request Body / Params | Description |
|---|---|---|---|---|
| `POST` | `/api/v1/auth/register` | None | `{ email, username, password, fullName? }` | Create a new user account |
| `POST` | `/api/v1/auth/login` | None | `{ emailOrUsername, password }` | Login and receive JWT access & refresh tokens |
| `POST` | `/api/v1/auth/refresh` | None | `{ refreshToken }` | Rotate refresh token and get a new access token |
| `POST` | `/api/v1/auth/logout` | `Bearer` | `{ refreshToken }` | Revoke session and logout |
| `GET` | `/api/v1/auth/me` | `Bearer` | None | Get current authenticated user details |
| `PATCH` | `/api/v1/auth/password` | `Bearer` | `{ currentPassword, newPassword }` | Change account password |

---

### 👤 User Profiles & Follows (`/api/v1/users`)

| Method | Endpoint | Auth | Request Body / Params | Description |
|---|---|---|---|---|
| `GET` | `/api/v1/users/search` | Optional | Query: `?q=...&page=1&limit=10` | Search users by username or full name |
| `PATCH` | `/api/v1/users/profile` | `Bearer` | `{ fullName?, bio?, avatarUrl?, website? }` | Update current user's profile |
| `GET` | `/api/v1/users/:username` | Optional | Params: `:username` | Get profile with stats (`postsCount`, `followersCount`, `isFollowing`, `isSelf`) |
| `GET` | `/api/v1/users/:username/posts` | Optional | Params: `:username`, Query: `?page=1&limit=12` | Get paginated posts created by a user |
| `POST` | `/api/v1/users/:username/follow` | `Bearer` | Params: `:username` | Follow a user |
| `DELETE`| `/api/v1/users/:username/follow` | `Bearer` | Params: `:username` | Unfollow a user |
| `GET` | `/api/v1/users/:username/followers` | Optional | Params: `:username`, Query: `?page=1&limit=20` | Get list of followers for a user |
| `GET` | `/api/v1/users/:username/following` | Optional | Params: `:username`, Query: `?page=1&limit=20` | Get list of accounts followed by a user |

---

### 🖼️ Posts (`/api/v1/posts`)

| Method | Endpoint | Auth | Request Body / Params | Description |
|---|---|---|---|---|
| `POST` | `/api/v1/posts` | `Bearer` | `{ mediaUrls: string[], caption?, location? }` | Create a new photo/video post |
| `GET` | `/api/v1/posts/:id` | Optional | Params: `:id` (UUID) | Get post details (`likesCount`, `commentsCount`, `isLiked`, `isAuthor`) |
| `DELETE`| `/api/v1/posts/:id` | `Bearer` | Params: `:id` (UUID) | Delete post (only author can delete) |

---

### 📰 Feeds (`/api/v1/feed`)

| Method | Endpoint | Auth | Request Body / Params | Description |
|---|---|---|---|---|
| `GET` | `/api/v1/feed` | `Bearer` | Query: `?page=1&limit=10` | Chronological Home Feed (posts from followed accounts + self) |
| `GET` | `/api/v1/feed/explore` | Optional | Query: `?page=1&limit=20` | Explore / Discovery Feed (all public posts sorted by newest) |

---

### ❤️ Likes (`/api/v1/posts/:id/like`)

| Method | Endpoint | Auth | Request Body / Params | Description |
|---|---|---|---|---|
| `POST` | `/api/v1/posts/:id/like` | `Bearer` | Params: `:id` (UUID) | Like a post (idempotent) |
| `DELETE`| `/api/v1/posts/:id/like` | `Bearer` | Params: `:id` (UUID) | Unlike a post |
| `GET` | `/api/v1/posts/:id/likes` | Optional | Params: `:id`, Query: `?page=1&limit=20` | Get list of users who liked the post |

---

### 💬 Comments (`/api/v1/posts/:id/comments`)

| Method | Endpoint | Auth | Request Body / Params | Description |
|---|---|---|---|---|
| `POST` | `/api/v1/posts/:id/comments` | `Bearer` | `{ content: string }` | Add a comment to a post |
| `GET` | `/api/v1/posts/:id/comments` | Optional | Params: `:id`, Query: `?page=1&limit=20` | Get comments on a post (paginated) |
| `DELETE`| `/api/v1/posts/:id/comments/:commentId` | `Bearer` | Params: `:id`, `:commentId` | Delete a comment (comment author or post owner) |

---

## 💎 Frontend Production Architecture & Coding Style Guide

To build a clean, resilient, and scalable frontend for this challenge, developers should follow this **4-tier architecture pattern**:

```
UI Components / Routes
       │
       ▼
TanStack Query Hooks (hooks/api/*.ts)  ───► Zustand Stores (stores/*.ts)
       │
       ▼
API Service Layer (services/*.api.ts)
       │
       ▼
HTTP Client + 401 Queue Interceptor (lib/http-client.ts)
```

---

### 1. Centralized HTTP Client & 401 Refresh Interceptor (`lib/http-client.ts`)

Instead of making raw `fetch` calls in components, use a centralized Axios instance that:
1. Automatically attaches the `Authorization: Bearer <accessToken>` header to all requests.
2. Automatically intercepts `401 Unauthorized` responses, queues pending calls, rotates the `refreshToken`, and replays failed requests seamlessly without logging the user out.

```typescript
// apps/web/src/lib/http-client.ts
import { env } from "@instgarm_feed/env/web";
import axios, { type InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "../stores/auth.store";

const serverBaseURL = env.VITE_SERVER_URL;

export const httpClient = axios.create({
  baseURL: serverBaseURL,
  headers: { "Content-Type": "application/json" },
  timeout: 10_000,
});

// Helper functions for token storage in localStorage
export const getAccessToken = () => localStorage.getItem("accessToken");
export const getRefreshToken = () => localStorage.getItem("refreshToken");

export const setTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
};

export const clearTokens = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  useAuthStore.getState().logout();
};

// 1. Request Interceptor: Attach Bearer token
httpClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: unknown) => Promise.reject(error),
);

// 2. Response Interceptor: Queue & handle 401s with token refresh
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      // Avoid infinite loop on auth routes
      if (
        originalRequest.url?.includes("/auth/refresh") ||
        originalRequest.url?.includes("/auth/login") ||
        originalRequest.url?.includes("/auth/register")
      ) {
        return Promise.reject(error);
      }

      // If already refreshing, wait in line
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers && typeof token === "string") {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return httpClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        clearTokens();
        window.dispatchEvent(new Event("auth:logout"));
        return Promise.reject(error);
      }

      try {
        // Request fresh tokens
        const { data } = await axios.post(`${serverBaseURL}/api/v1/auth/refresh`, {
          refreshToken,
        });

        const newAccessToken = data.data.accessToken;
        const newRefreshToken = data.data.refreshToken;
        setTokens(newAccessToken, newRefreshToken);

        httpClient.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }

        processQueue(null, newAccessToken);
        return httpClient(originalRequest);
      } catch (err) {
        processQueue(err, null);
        clearTokens();
        window.dispatchEvent(new Event("auth:logout"));
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);
```

---

### 2. API Service Layer (`services/auth.api.ts`)

Keep your API calls neatly organized in pure async service functions:

```typescript
// apps/web/src/services/auth.api.ts
import { httpClient, setTokens, clearTokens, getRefreshToken } from "../lib/http-client";

export interface RegisterInput {
  email: string;
  username: string;
  password: string;
  fullName?: string;
}

export interface LoginInput {
  emailOrUsername: string;
  password: string;
}

export const authApi = {
  register: async (input: RegisterInput) => {
    const { data } = await httpClient.post("/api/v1/auth/register", input);
    if (data.success && data.data) {
      setTokens(data.data.accessToken, data.data.refreshToken);
    }
    return data;
  },

  login: async (input: LoginInput) => {
    const { data } = await httpClient.post("/api/v1/auth/login", input);
    if (data.success && data.data) {
      setTokens(data.data.accessToken, data.data.refreshToken);
    }
    return data;
  },

  logout: async () => {
    try {
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        await httpClient.post("/api/v1/auth/logout", { refreshToken });
      }
    } finally {
      clearTokens();
    }
  },

  getMe: async () => {
    const { data } = await httpClient.get("/api/v1/auth/me");
    return data;
  },
};
```

---

### 3. Zustand Persistent Auth Store (`stores/auth.store.ts`)

Use Zustand with `persist` middleware to hold user authentication state across browser refreshes:

```typescript
// apps/web/src/stores/auth.store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  id: string;
  email: string;
  username: string;
  fullName: string | null;
  avatarUrl: string | null;
  bio: string | null;
  website: string | null;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      login: (user) => set({ isAuthenticated: true, user }),
      logout: () => set({ isAuthenticated: false, user: null }),
    }),
    {
      name: "auth-storage", // Stored in localStorage
    },
  ),
);
```

---

### 4. TanStack Query Custom Hooks (`hooks/api/use-auth.ts`)

Use TanStack Query for server data fetching, mutations, caching, and cache invalidation:

```typescript
// apps/web/src/hooks/api/use-auth.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "../../services/auth.api";
import { useAuthStore } from "../../stores/auth.store";

export const authKeys = {
  all: ["auth"] as const,
  me: () => [...authKeys.all, "me"] as const,
};

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      if (data?.data?.user) {
        useAuthStore.getState().login(data.data.user);
      }
      queryClient.invalidateQueries({ queryKey: authKeys.me() });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.logout,
    onSettled: () => {
      useAuthStore.getState().logout();
      queryClient.clear(); // Clear cached queries on logout
    },
  });
}

export function useUser() {
  return useQuery({
    queryKey: authKeys.me(),
    queryFn: authApi.getMe,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
```

---

### 5. Production Form Integration with React Hook Form & Zod

**Important**: Do NOT use raw `useState` for complex forms. All client forms must use **`react-hook-form`** with **`@hookform/resolvers/zod`** to guarantee client-side schema validation matching the backend Zod contracts before network requests are made.

```tsx
// apps/web/src/routes/login.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLogin } from "@/hooks/api/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// 1. Define Zod validation schema matching backend contracts
const loginSchema = z.object({
  emailOrUsername: z
    .string()
    .min(1, "Username or email is required"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginPage() {
  const loginMutation = useLogin();

  // 2. Initialize React Hook Form with Zod Resolver
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      emailOrUsername: "",
      password: "",
    },
  });

  // 3. Strongly typed submit handler
  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6 rounded-lg border bg-card p-6 shadow-sm">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight">Instagram</h1>
          <p className="text-sm text-muted-foreground">
            Sign in with your username or email
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email or Username Field */}
          <div className="space-y-1">
            <Label htmlFor="emailOrUsername">Username or Email</Label>
            <Input
              id="emailOrUsername"
              type="text"
              placeholder="e.g. johndoe or user@example.com"
              disabled={loginMutation.isPending || isSubmitting}
              {...register("emailOrUsername")}
            />
            {errors.emailOrUsername && (
              <p className="text-xs text-destructive font-medium">
                {errors.emailOrUsername.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-1">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              disabled={loginMutation.isPending || isSubmitting}
              {...register("password")}
            />
            {errors.password && (
              <p className="text-xs text-destructive font-medium">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Server Error Message */}
          {loginMutation.isError && (
            <div className="p-3 rounded bg-destructive/10 text-destructive text-sm font-medium">
              {loginMutation.error instanceof Error
                ? loginMutation.error.message
                : "Invalid credentials. Please try again."}
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loginMutation.isPending || isSubmitting}
            className="w-full"
          >
            {loginMutation.isPending ? "Logging in..." : "Log In"}
          </Button>
        </form>
      </div>
    </div>
  );
}
```

---

## 🛠️ Monorepo Commands Cheat Sheet

| Command | Description |
|---|---|
| `bun install` | Install all dependencies across all packages in monorepo |
| `bun dev` | Start all services simultaneously (backend, web, native) |
| `bun run dev:server` | Start only the Express API backend (`http://localhost:3000`) |
| `bun run dev:web` | Start only the Web frontend (`http://localhost:5173`) |
| `bun run dev:native` | Start only the React Native Expo bundler |
| `bun run db:start` | Start PostgreSQL container in Docker |
| `bun run db:stop` | Stop PostgreSQL Docker container |
| `bun run db:generate` | Re-generate Prisma Client TypeScript types |
| `bun run db:push` | Push Prisma schema changes to PostgreSQL database |
| `bun run db:studio` | Open Prisma Studio UI in browser (`http://localhost:5555`) |
| `bun test` | Run all E2E backend and frontend test suites |
| `bun run check-types` | Run strict TypeScript checks with zero errors |
| `bun run build` | Build all applications for production |

---

## ❓ Beginner Troubleshooting & FAQ

### 1. `error: connect ECONNREFUSED 127.0.0.1:5432`
- **Cause**: PostgreSQL is not running.
- **Fix**: Run `bun run db:start` to start the PostgreSQL Docker container (ensure Docker Desktop is running), or start your local PostgreSQL service.

### 2. `Cannot find module '@prisma/client'` or Prisma type errors
- **Cause**: Prisma Client has not been generated yet.
- **Fix**: Run `bun run db:generate`.

### 3. `Port 3000 is already in use`
- **Cause**: Another process is running on port 3000.
- **Fix**: You can change `PORT=3001` in your `.env` file, or stop the conflicting application.

### 4. `401 Unauthorized` API error
- **Cause**: The route requires authentication and either no token was sent or the token expired.
- **Fix**: Send the HTTP header `Authorization: Bearer <your_access_token>`. If expired, call `POST /api/v1/auth/refresh` or login again.

### 5. `400 Validation error`
- **Cause**: The data sent does not match the required Zod schema (e.g., invalid email, password too short, missing fields).
- **Fix**: Check the `validationErrors` array in the response JSON or inspect the request body schema in the **[Scalar Docs](http://localhost:3000/api/docs)**.

---

## 🤝 Contributing & Submitting Solutions

1. Create a branch for your feature:
   ```bash
   git checkout -b feat/your-name-feed-ui
   ```
2. Verify that everything builds and tests pass:
   ```bash
   bun run check-types
   bun test
   ```
3. Commit your work:
   ```bash
   git add .
   git commit -m "feat: add instagram feed and profile UI"
   ```
4. Push and open a Pull Request using the included [.github/pull_request_template.md](.github/pull_request_template.md).

---

*Happy Coding & Good Luck with the Developer Club Challenge! 🚀*

*Happy Ending & Good Body  🚀*

*Happy Laughinh & Good Figure with the Developer Club Challenge! 🚀*


*I am not a coder.


*I am a pro coder

