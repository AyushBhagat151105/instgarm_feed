# Instagram Feed & Profile Backend API

This backend API powers the Instagram Feed and Profile clone developer challenge. It provides a complete, production-ready REST API built with Express, TypeScript, Prisma (PostgreSQL), and Zod, complete with interactive **Scalar API Reference** documentation.

---

## 🚀 Quick Start

### 1. Start Database & Server

```bash
# Push database schema to PostgreSQL
bun db:push

# Run server in development mode (hot reloading)
bun --filter server dev
```

The server starts on `http://localhost:3000`.

---

## 📖 Interactive API Documentation (Scalar)

The backend features interactive API documentation powered by `@scalar/express-api-reference` and `@asteasolutions/zod-to-openapi`:

- **Interactive API Playground**: [http://localhost:3000/api/docs](http://localhost:3000/api/docs)
- **Raw OpenAPI 3.1 JSON Specification**: [http://localhost:3000/api/docs/openapi.json](http://localhost:3000/api/docs/openapi.json)

Frontend teams can inspect every route, URL parameter, query string, request body schema, and response model directly inside the Scalar UI, and execute test requests live with instant feedback.

---

## 🔒 Authentication Flow

1. **Register or Login** (`POST /api/v1/auth/register` or `POST /api/v1/auth/login`):
   - Returns an `accessToken` (JWT, 1 day validity) and a `refreshToken` (tracked in database session, 7 days validity).
2. **Authenticated Requests**:
   - Send the header: `Authorization: Bearer <accessToken>`
3. **Token Refresh** (`POST /api/v1/auth/refresh`):
   - Provide `{ "refreshToken": "<token>" }` to get a fresh `accessToken` and rotated `refreshToken`.
4. **Logout** (`POST /api/v1/auth/logout`):
   - Revokes the refresh token session in the database.

---

## 📡 API Overview (`/api/v1`)

### 1. Authentication (`/api/v1/auth`)
| Method | Path | Security | Description |
|---|---|---|---|
| `POST` | `/api/v1/auth/register` | None | Register new user account |
| `POST` | `/api/v1/auth/login` | None | Authenticate with email or username |
| `POST` | `/api/v1/auth/refresh` | None | Obtain fresh token pair via refresh token |
| `POST` | `/api/v1/auth/logout` | Bearer | Revoke active refresh session |
| `GET` | `/api/v1/auth/me` | Bearer | Get current authenticated user profile |
| `PATCH` | `/api/v1/auth/password` | Bearer | Change user account password |

### 2. Users & Profiles (`/api/v1/users`)
| Method | Path | Security | Description |
|---|---|---|---|
| `GET` | `/api/v1/users/search` | Optional | Search users by username or display name |
| `PATCH` | `/api/v1/users/profile` | Bearer | Update user profile (bio, fullName, avatarUrl, website) |
| `GET` | `/api/v1/users/:username` | Optional | Get public user profile and stats |
| `GET` | `/api/v1/users/:username/posts`| Optional | Get paginated posts created by a user |
| `POST` | `/api/v1/users/:username/follow`| Bearer | Follow a user |
| `DELETE` | `/api/v1/users/:username/follow`| Bearer | Unfollow a user |
| `GET` | `/api/v1/users/:username/followers`| Optional| List accounts following this user |
| `GET` | `/api/v1/users/:username/following`| Optional| List accounts followed by this user |

### 3. Posts (`/api/v1/posts`)
| Method | Path | Security | Description |
|---|---|---|---|
| `POST` | `/api/v1/posts` | Bearer | Create a post (mediaUrls, caption, location) |
| `GET` | `/api/v1/posts/:id` | Optional | Get post details, author, and engagement counts |
| `DELETE` | `/api/v1/posts/:id` | Bearer | Delete post (author only) |

### 4. Feed (`/api/v1/feed`)
| Method | Path | Security | Description |
|---|---|---|---|
| `GET` | `/api/v1/feed` | Bearer | Chronological home feed (followed accounts + self) |
| `GET` | `/api/v1/feed/explore` | Optional | Explore feed (public discovery posts) |

### 5. Likes (`/api/v1/posts/:id/like`)
| Method | Path | Security | Description |
|---|---|---|---|
| `POST` | `/api/v1/posts/:id/like` | Bearer | Like a post |
| `DELETE` | `/api/v1/posts/:id/like` | Bearer | Unlike a post |
| `GET` | `/api/v1/posts/:id/likes` | Optional | List users who liked the post |

### 6. Comments (`/api/v1/posts/:id/comments`)
| Method | Path | Security | Description |
|---|---|---|---|
| `POST` | `/api/v1/posts/:id/comments` | Bearer | Add a comment to a post |
| `GET` | `/api/v1/posts/:id/comments` | Optional | Get chronological comments for a post |
| `DELETE` | `/api/v1/posts/:id/comments/:commentId`| Bearer | Delete comment (author or post owner) |

---

## 🧪 Running Tests

```bash
bun --filter server test
```
