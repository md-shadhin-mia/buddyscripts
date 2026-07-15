# BuddyScript — Full-Stack Social Networking Application

A full-stack social networking platform built with Next.js 16, Express 5, Prisma, and PostgreSQL. Features authentication, social feed with visibility tiers, comments with threaded replies, reactions, stories, friend system, notifications, events, and real-time updates via Socket.IO.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 16 (App Router), TypeScript, Bootstrap 5, TanStack React Query 5 |
| **Backend** | Node.js, Express 5, TypeScript, Prisma 7 ORM |
| **Database** | PostgreSQL |
| **Auth** | JWT (access + refresh token rotation), bcrypt |
| **Real-time** | Socket.IO |
| **Storage** | S3-compatible (AWS S3, MinIO, DigitalOcean Spaces, etc.) |
| **Validation** | Zod 4 |
| **Testing** | Vitest + Supertest |

---

## Architecture

```
buddyscripts/
├── app/                    # Next.js frontend
│   ├── app/                # App Router pages
│   │   ├── page.tsx        # Feed (protected)
│   │   ├── login/          # Login page
│   │   └── register/       # Registration page
│   ├── components/         # React components
│   ├── hooks/              # Custom hooks (TanStack Query wrappers)
│   └── lib/                # Context providers, API client, types
├── server/                 # Express backend
│   ├── prisma/
│   │   ├── schema.prisma   # Database schema (14 models)
│   │   └── seed.ts         # Seed script with demo data
│   ├── src/
│   │   ├── config/         # DB, env, S3 config
│   │   ├── middleware/     # Auth, validation, error handling
│   │   ├── modules/        # Feature modules (routes → controller → service)
│   │   ├── socket/         # Socket.IO setup + handlers
│   │   ├── jobs/           # Cron jobs (story cleanup, notification pruning)
│   │   └── lib/            # Utilities (errors, JWT, pagination)
│   └── src/__tests__/      # Integration + unit tests
└── package.json            # Root orchestrator (concurrently)
```

### Backend Module Pattern

Every feature follows a strict layered architecture:

```
routes.ts → controller.ts → service.ts → prisma
```

Modules: `auth`, `users`, `posts`, `comments`, `reactions`, `stories`, `friends`, `friend-requests`, `notifications`, `events`, `upload`, `search`, `health`

---

## Features

### 1. Authentication & Authorization
- JWT-based with access tokens (15 min) and refresh token rotation (7 days)
- Refresh tokens stored hashed in DB, rotated on each use, delivered via httpOnly cookies
- Registration: first name, last name, email, password (bcrypt, 12 rounds)
- Zod validation on all inputs, fail-fast env validation on startup

### 2. Feed Page (Protected Route)
- Cursor-based pagination for O(1) seek at any dataset size
- Posts sorted newest-first
- Three-tier visibility: **Public** (everyone), **Friends** (friends only), **Private** (author only)
- Hidden posts support — users can hide posts from their feed
- Infinite scroll with TanStack Query's `useInfiniteQuery`

### 3. Posts
- Create posts with text and images (uploaded to S3)
- Edit and soft-delete own posts
- Save/bookmark posts
- Image upload via multipart → S3, served through a proxy endpoint

### 4. Comments & Replies
- Nested threaded replies (via `parentId` self-reference)
- Soft deletes
- Cursor-based pagination
- Comment reactions

### 5. Reactions (Like/Unlike)
- 6 reaction types: LIKE, LOVE, HAHA, WOW, SAD, ANGRY
- Toggle behavior: same type re-click removes, different type updates
- DB-level uniqueness enforcement (`@@unique([postId, userId, type])`)
- See who has reacted to any post, comment, or reply

### 6. Stories
- 24-hour auto-expiring stories
- View tracking per user
- Cron job cleans up expired stories hourly

### 7. Friend System
- Send, accept, decline, cancel friend requests
- Unfriend
- Friend suggestions

### 8. Notifications
- Real-time delivery via Socket.IO
- Types: friend requests, reactions, comments, replies, event invites
- Unread count badge, mark read, mark all read
- Automatic pruning of read notifications older than 30 days

### 9. Events
- Create, edit, delete events
- RSVP (going, maybe, not going)

### 10. Search
- Search across users, posts, and events
- Case-insensitive matching

### 11. Real-time Updates
- Socket.IO integration for notifications, friend requests, and presence (online/offline)
- React Query cache invalidation on real-time events

### 12. UI/UX
- Responsive design (Bootstrap 5 + custom CSS)
- Dark mode toggle (persisted to localStorage)
- Mobile-friendly with dedicated mobile navigation

---

## Database Schema

14 models with composite indexes designed for scale:

| Model | Purpose |
|-------|---------|
| **User** | User accounts with profile |
| **RefreshToken** | Hashed refresh tokens (bcrypt) |
| **Post** | Feed posts with visibility enum |
| **Comment** | Top-level and nested replies (parentId) |
| **Reaction** | 6-type reactions with DB uniqueness |
| **Story** | 24h stories with view tracking |
| **StoryViewer** | Per-user story views |
| **FriendRequest** | Pending/declined requests |
| **Friendship** | Bidirectional with sorted IDs |
| **Notification** | Polymorphic notification records |
| **Event** | Social events |
| **EventAttendee** | RSVP tracking |
| **SavedPost** | Bookmarked posts |
| **HiddenPost** | Hidden posts |

---

## API Endpoints

### Auth (`/api/auth`)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/register` | Create account |
| POST | `/login` | Login (access token + httpOnly refresh cookie) |
| POST | `/refresh` | Rotate refresh token |
| POST | `/logout` | Invalidate session |

### Posts (`/api/posts`)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Feed (cursor pagination) |
| POST | `/` | Create post |
| GET | `/:id` | Get post |
| PUT | `/:id` | Edit post |
| DELETE | `/:id` | Soft delete |
| POST | `/:id/save` | Save post |
| DELETE | `/:id/save` | Unsave post |
| GET | `/saved` | Saved posts |

### Comments (`/api/posts/:postId/comments`)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | List comments |
| POST | `/` | Add comment |
| PUT | `/:id` | Edit comment |
| DELETE | `/:id` | Soft delete |
| POST | `/:id/reply` | Reply to comment |

### Reactions (`/api`)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/posts/:postId/reactions` | React to post |
| DELETE | `/posts/:postId/reactions` | Remove reaction |
| GET | `/posts/:postId/reactions` | List reactions |
| POST | `/comments/:commentId/reactions` | React to comment |
| DELETE | `/comments/:commentId/reactions` | Remove comment reaction |

### Stories, Friends, Notifications, Events, Search — see `API_PLAN.md` for full details.

---

## Getting Started

### Prerequisites
- Node.js 22+
- PostgreSQL
- S3-compatible storage (optional — file upload works without it)

### Installation

```bash
# Clone and install dependencies
npm install
cd app && npm install
cd ../server && npm install
```

### Environment Variables

**Server** (`server/.env`):
```env
DATABASE_URL="postgresql://user:password@localhost:5432/buddyscript"
JWT_ACCESS_SECRET="your-access-secret-min-32-chars"
JWT_REFRESH_SECRET="your-refresh-secret-min-32-chars"
JWT_ACCESS_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"
CORS_ORIGIN="http://localhost:3001"
PORT=3000
```

**App** (`app/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Database Setup

```bash
cd server
npx prisma migrate dev
npm run seed   # Creates 20 demo users + sample data
```

### Run Development

```bash
# From root — runs both frontend and backend
npm run dev
```

Or individually:
```bash
cd server && npm run dev   # Backend on :3000
cd app && npm run dev      # Frontend on :3001
```

### Demo Accounts

After seeding, all 20 users have password: `password123`

---

## Testing

```bash
cd server
npm run test        # Vitest integration + unit tests
npm run test:watch  # Watch mode
```

---

## Deployment

### Frontend
Deploy the `app/` directory to Netlify (uses `@netlify/plugin-nextjs`):
```bash
cd app
npm run build
```

### Backend
```bash
cd server
npm run build
npm run migrate:prod
npm run start       # node dist/server.js
```

---

## Design Decisions

| Decision | Rationale |
|----------|-----------|
| **Cursor pagination** | O(1) seek regardless of dataset size — essential for "millions of posts" scale |
| **Refresh token rotation** | Limits window of compromise on token theft |
| **Soft deletes** | Preserves referential integrity for comments/reactions on deleted posts |
| **Composite unique on reactions** | DB-level enforcement prevents duplicate reactions without application-level locking |
| **Sorted Friendship IDs** | Single unique index `[user1Id, user2Id]` covers both query directions |
| **Layered modules** | Separation of concerns — routes, controllers, services, validation are independent and testable |
| **Real-time via Socket.IO** | Instant notifications without polling, integrated service-side with REST endpoints |
| **S3 abstraction** | Works with any S3-compatible provider (AWS, MinIO, DigitalOcean Spaces) — no vendor lock-in |
| **Zod env validation** | Fail-fast on startup if required secrets are missing |

---

## Project Context

This project was built as a full-stack engineering assignment demonstrating:
- Secure authentication with industry-standard JWT practices
- Scalable database design with composite indexes
- Real-time features via WebSockets
- Clean architecture with separation of concerns
- Comprehensive testing strategy
- Production-ready deployment configuration
