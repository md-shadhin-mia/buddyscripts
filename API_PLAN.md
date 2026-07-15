# BuddyScript API — System Design Plan

## Tech Stack

- **Runtime:** Node.js + TypeScript
- **Framework:** Express.js
- **ORM:** Prisma (PostgreSQL)
- **Auth:** JWT (access + refresh token rotation)
- **Real-time:** Socket.IO
- **Storage:** S3-compatible (abstracted endpoint)
- **Architecture:** Monolith with layered modules (routes → controllers → services → prisma)

---

## 1. Project Structure

```
buddyscript-api/
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
├── src/
│   ├── config/
│   │   ├── database.ts              # Prisma singleton
│   │   ├── env.ts                    # Env validation (zod)
│   │   ├── s3.ts                     # S3 client
│   │   └── socket.ts                 # Socket.IO setup
│   ├── middleware/
│   │   ├── authenticate.ts           # JWT verification
│   │   ├── authorize.ts              # Role/ownership check
│   │   ├── errorHandler.ts           # Global error handler
│   │   └── validate.ts               # Zod schema validation
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.routes.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   └── auth.validation.ts
│   │   ├── users/
│   │   │   ├── users.routes.ts
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   └── users.validation.ts
│   │   ├── posts/
│   │   │   ├── posts.routes.ts
│   │   │   ├── posts.controller.ts
│   │   │   ├── posts.service.ts
│   │   │   └── posts.validation.ts
│   │   ├── comments/
│   │   │   ├── comments.routes.ts
│   │   │   ├── comments.controller.ts
│   │   │   ├── comments.service.ts
│   │   │   └── comments.validation.ts
│   │   ├── reactions/
│   │   │   ├── reactions.routes.ts
│   │   │   ├── reactions.controller.ts
│   │   │   ├── reactions.service.ts
│   │   │   └── reactions.validation.ts
│   │   ├── stories/
│   │   │   ├── stories.routes.ts
│   │   │   ├── stories.controller.ts
│   │   │   ├── stories.service.ts
│   │   │   └── stories.validation.ts
│   │   ├── friends/
│   │   │   ├── friends.routes.ts
│   │   │   ├── friends.controller.ts
│   │   │   ├── friends.service.ts
│   │   │   └── friends.validation.ts
│   │   ├── notifications/
│   │   │   ├── notifications.routes.ts
│   │   │   ├── notifications.controller.ts
│   │   │   ├── notifications.service.ts
│   │   │   └── notifications.validation.ts
│   │   ├── events/
│   │   │   ├── events.routes.ts
│   │   │   ├── events.controller.ts
│   │   │   ├── events.service.ts
│   │   │   └── events.validation.ts
│   │   ├── upload/
│   │   │   ├── upload.routes.ts
│   │   │   ├── upload.controller.ts
│   │   │   └── upload.service.ts
│   │   └── search/
│   │       ├── search.routes.ts
│   │       ├── search.controller.ts
│   │       └── search.service.ts
│   ├── socket/
│   │   ├── index.ts                  # Socket.IO server init
│   │   ├── authenticate.ts           # Socket JWT middleware
│   │   └── handlers/
│   │       ├── friendRequest.ts
│   │       ├── notification.ts
│   │       └── presence.ts
│   ├── jobs/
│   │   ├── storyCleanup.ts           # Delete expired stories (node-cron)
│   │   └── notificationCleanup.ts    # Prune old read notifications
│   ├── lib/
│   │   ├── errors.ts                 # ApiError, ApiSuccess classes
│   │   ├── asyncHandler.ts           # try/catch wrapper
│   │   ├── jwt.ts                    # sign/verify/refresh helpers
│   │   └── pagination.ts            # Cursor pagination helper
│   ├── app.ts                        # Express app (middleware, routes)
│   └── server.ts                     # HTTP + Socket.IO entry
├── package.json
├── tsconfig.json
├── .env.example
└── docker-compose.yml                # Postgres
```

Each module follows: `routes.ts` → `controller.ts` → `service.ts` → `prisma`

---

## 2. Database Schema (Prisma)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─── ENUMS ──────────────────────────────────────────

enum ReactionType {
  LIKE
  LOVE
  HAHA
  WOW
  SAD
  ANGRY
}

enum PostVisibility {
  PUBLIC
  FRIENDS
  PRIVATE
}

enum FriendRequestStatus {
  PENDING
  ACCEPTED
  DECLINED
}

enum NotificationEntityType {
  POST
  COMMENT
  FRIEND_REQUEST
  EVENT
}

enum NotificationType {
  FRIEND_REQUEST
  FRIEND_ACCEPTED
  POST_REACTION
  POST_COMMENT
  COMMENT_REPLY
  EVENT_INVITE
}

enum EventAttendeeStatus {
  GOING
  MAYBE
  NOT_GOING
}

// ─── MODELS ─────────────────────────────────────────

model User {
  id          String   @id @default(cuid())
  email       String   @unique
  password    String
  name        String
  avatar      String?
  bio         String?  @db.Text
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  posts                  Post[]
  comments               Comment[]
  reactions              Reaction[]
  stories                Story[]
  sentFriendRequests       FriendRequest[]  @relation("SentRequests")
  receivedFriendRequests   FriendRequest[]  @relation("ReceivedRequests")
  friendshipsAsUser1       Friendship[]     @relation("User1")
  friendshipsAsUser2       Friendship[]     @relation("User2")
  notificationsReceived    Notification[]   @relation("NotificationRecipient")
  notificationsTriggered   Notification[]   @relation("NotificationActor")
  eventsCreated            Event[]
  eventAttendances         EventAttendee[]
  refreshTokens            RefreshToken[]
  savedPosts               SavedPost[]
  hiddenPosts              HiddenPost[]

  @@index([email])
  @@index([name])
  @@index([createdAt(sort: Desc)])
}

model RefreshToken {
  id        String   @id @default(cuid())
  token     String   @unique
  userId    String
  expiresAt DateTime
  createdAt DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([token])
  @@index([expiresAt])
}

model Post {
  id         String         @id @default(cuid())
  content    String         @db.Text
  imageUrl   String?
  visibility PostVisibility @default(PUBLIC)
  authorId   String
  createdAt  DateTime       @default(now())
  updatedAt  DateTime       @updatedAt
  deletedAt  DateTime?

  author   User          @relation(fields: [authorId], references: [id])
  comments Comment[]
  reactions Reaction[]
  savedBy  SavedPost[]
  hiddenBy HiddenPost[]

  @@index([authorId, createdAt(sort: Desc)])
  @@index([createdAt(sort: Desc)])
  @@index([visibility, createdAt(sort: Desc)])
  @@index([deletedAt])
  @@index([authorId, deletedAt])
}

model Comment {
  id        String   @id @default(cuid())
  content   String   @db.Text
  postId    String
  authorId  String
  parentId  String?                     // null = top-level comment, non-null = reply
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  deletedAt DateTime?

  post     Post      @relation(fields: [postId], references: [id])
  author   User      @relation(fields: [authorId], references: [id])
  parent   Comment?  @relation("CommentReplies", fields: [parentId], references: [id])
  replies  Comment[] @relation("CommentReplies")
  reactions Reaction[]

  @@index([postId, createdAt(sort: Desc)])
  @@index([authorId])
  @@index([parentId])
  @@index([deletedAt])
}

model Reaction {
  id        String       @id @default(cuid())
  type      ReactionType
  postId    String?
  commentId String?
  userId    String
  createdAt DateTime     @default(now())

  post    Post?    @relation(fields: [postId], references: [id])
  comment Comment? @relation(fields: [commentId], references: [id])
  user    User     @relation(fields: [userId], references: [id])

  @@unique([postId, userId, type])
  @@unique([commentId, userId, type])
  @@index([postId])
  @@index([commentId])
  @@index([userId])
  @@index([postId, type])
}

model Story {
  id        String   @id @default(cuid())
  imageUrl  String
  content   String?  @db.Text
  authorId  String
  viewCount Int      @default(0)
  createdAt DateTime @default(now())

  author  User          @relation(fields: [authorId], references: [id])
  viewers StoryViewer[]

  @@index([authorId, createdAt(sort: Desc)])
  @@index([createdAt(sort: Desc)])    // for cleanup job
}

model StoryViewer {
  id       String   @id @default(cuid())
  storyId  String
  userId   String
  viewedAt DateTime @default(now())

  story Story @relation(fields: [storyId], references: [id], onDelete: Cascade)
  user  User  @relation(fields: [userId], references: [id])

  @@unique([storyId, userId])
  @@index([storyId])
}

model FriendRequest {
  id         String              @id @default(cuid())
  senderId   String
  receiverId String
  status     FriendRequestStatus @default(PENDING)
  createdAt  DateTime            @default(now())
  updatedAt  DateTime            @updatedAt

  sender   User @relation("SentRequests", fields: [senderId], references: [id])
  receiver User @relation("ReceivedRequests", fields: [receiverId], references: [id])

  @@unique([senderId, receiverId])
  @@index([receiverId, status])    // pending requests inbox
  @@index([senderId, status])
}

model Friendship {
  id        String   @id @default(cuid())
  user1Id   String   // always the lexicographically smaller id
  user2Id   String   // always the lexicographically larger id
  createdAt DateTime @default(now())

  user1 User @relation("User1", fields: [user1Id], references: [id])
  user2 User @relation("User2", fields: [user2Id], references: [id])

  @@unique([user1Id, user2Id])
  @@index([user1Id])
  @@index([user2Id])
}

model Notification {
  id         String                 @id @default(cuid())
  userId     String                 // recipient
  actorId    String                 // who triggered it
  type       NotificationType
  entityType NotificationEntityType
  entityId   String                 // polymorphic: post/comment/friendRequest/event id
  message    String?
  isRead     Boolean                @default(false)
  createdAt  DateTime               @default(now())

  user  User @relation("NotificationRecipient", fields: [userId], references: [id])
  actor User @relation("NotificationActor", fields: [actorId], references: [id])

  @@index([userId, isRead, createdAt(sort: Desc)])
  @@index([userId, createdAt(sort: Desc)])
  @@index([createdAt(sort: Desc)])
}

model Event {
  id          String   @id @default(cuid())
  title       String
  description String?  @db.Text
  imageUrl    String?
  location    String?
  startDate   DateTime
  endDate     DateTime
  creatorId   String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  creator   User            @relation(fields: [creatorId], references: [id])
  attendees EventAttendee[]

  @@index([startDate(sort: Desc)])
  @@index([creatorId])
  @@index([createdAt(sort: Desc)])
}

model EventAttendee {
  id        String              @id @default(cuid())
  eventId   String
  userId    String
  status    EventAttendeeStatus @default(GOING)
  createdAt DateTime            @default(now())

  event Event @relation(fields: [eventId], references: [id])
  user  User  @relation(fields: [userId], references: [id])

  @@unique([eventId, userId])
  @@index([eventId])
  @@index([userId])
}

model SavedPost {
  id        String   @id @default(cuid())
  userId    String
  postId    String
  createdAt DateTime @default(now())

  user User @relation(fields: [userId], references: [id])
  post Post @relation(fields: [postId], references: [id])

  @@unique([userId, postId])
  @@index([userId, createdAt(sort: Desc)])
}

model HiddenPost {
  id     String @id @default(cuid())
  userId String
  postId String

  user User @relation(fields: [userId], references: [id])
  post Post @relation(fields: [postId], references: [id])

  @@unique([userId, postId])
}
```

---

## 3. API Endpoints

### Auth (`/api/auth`)

| Method | Path              | Description                                                  |
| ------ | ----------------- | ------------------------------------------------------------ |
| POST   | `/register`       | Create account (email + password, bcrypt hash)               |
| POST   | `/login`          | Return access token + set refresh token in httpOnly cookie   |
| POST   | `/refresh`        | Rotate refresh token, issue new access token                 |
| POST   | `/logout`         | Invalidate refresh token, clear cookie                       |
| POST   | `/forgot-password`| Send reset email (SMTP)                                      |
| POST   | `/reset-password` | Validate reset token, set new password                       |

### Users (`/api/users`)

| Method | Path        | Description                                   |
| ------ | ----------- | --------------------------------------------- |
| GET    | `/me`       | Current user profile                          |
| PUT    | `/me`       | Update name, bio                              |
| PUT    | `/me/avatar`| Upload avatar (presigned URL → S3)            |
| GET    | `/:id`      | Public profile of another user                |
| GET    | `/:id/posts`| Posts by a user (cursor pagination)           |

### Posts (`/api/posts`)

| Method | Path        | Description                                          |
| ------ | ----------- | ---------------------------------------------------- |
| GET    | `/`         | Feed (cursor pagination, respects hidden + friends)  |
| POST   | `/`         | Create post (text + optional image presigned URL)    |
| GET    | `/:id`      | Single post                                          |
| PUT    | `/:id`      | Edit post (owner only)                               |
| DELETE | `/:id`      | Soft delete post (owner only)                        |
| POST   | `/:id/save` | Bookmark post                                        |
| DELETE | `/:id/save` | Remove bookmark                                      |
| GET    | `/saved`    | List saved posts                                     |

### Comments (`/api/posts/:postId/comments`)

| Method | Path                      | Description                    |
| ------ | ------------------------- | ------------------------------ |
| GET    | `/`                       | List comments (cursor)         |
| POST   | `/`                       | Add comment to post            |
| PUT    | `/comments/:id`           | Edit comment (owner only)      |
| DELETE | `/comments/:id`           | Soft delete comment            |
| POST   | `/comments/:id/reply`     | Reply to comment               |

### Reactions (`/api`)

| Method | Path                                 | Description                          |
| ------ | ------------------------------------ | ------------------------------------ |
| POST   | `/posts/:postId/reactions`           | React to post (body: `{ type }`)    |
| DELETE | `/posts/:postId/reactions`           | Remove own reaction from post       |
| GET    | `/posts/:postId/reactions`           | List reactions on post               |
| POST   | `/comments/:commentId/reactions`     | React to comment                     |
| DELETE | `/comments/:commentId/reactions`     | Remove own reaction from comment    |

### Stories (`/api/stories`)

| Method | Path        | Description                                    |
| ------ | ----------- | ---------------------------------------------- |
| GET    | `/`         | Active stories (not expired), grouped by user  |
| POST   | `/`         | Create story (auto-expires in 24h)             |
| DELETE | `/:id`      | Delete own story                               |
| POST   | `/:id/view` | Mark story as viewed                           |

### Friend Requests (`/api/friend-requests`)

| Method | Path             | Description                                    |
| ------ | ---------------- | ---------------------------------------------- |
| POST   | `/`              | Send request (body: `{ receiverId }`)         |
| PUT    | `/:id/accept`    | Accept (creates Friendship row)               |
| PUT    | `/:id/decline`   | Decline                                        |
| GET    | `/`              | List pending received requests                |
| GET    | `/sent`          | List pending sent requests                    |
| DELETE | `/:id`           | Cancel sent request                           |

### Friends (`/api/friends`)

| Method | Path            | Description                                    |
| ------ | --------------- | ---------------------------------------------- |
| GET    | `/`             | List all friends (cursor pagination)           |
| DELETE | `/:id`          | Unfriend                                       |
| GET    | `/suggestions`  | Suggested friends                              |

### Notifications (`/api/notifications`)

| Method | Path             | Description                                    |
| ------ | ---------------- | ---------------------------------------------- |
| GET    | `/`              | List notifications (cursor pagination)         |
| GET    | `/unread-count`  | Count of unread notifications                  |
| PUT    | `/:id/read`      | Mark one as read                               |
| PUT    | `/read-all`      | Mark all as read                               |

### Events (`/api/events`)

| Method | Path        | Description                                    |
| ------ | ----------- | ---------------------------------------------- |
| GET    | `/`         | List upcoming events                           |
| POST   | `/`         | Create event                                   |
| GET    | `/:id`      | Single event with attendee count               |
| PUT    | `/:id`      | Edit event (creator only)                      |
| DELETE | `/:id`      | Delete event (creator only)                    |
| POST   | `/:id/rsvp` | RSVP (body: `{ status: "GOING" }`)            |

### Upload (`/api/upload`)

| Method | Path              | Description                                    |
| ------ | ----------------- | ---------------------------------------------- |
| POST   | `/presigned-url`  | Generate presigned S3 URL for direct upload    |

### Search (`/api/search`)

| Method | Path                              | Description                         |
| ------ | --------------------------------- | ----------------------------------- |
| GET    | `/?q=&type=users\|posts\|events`  | Search across entities              |

---

## 4. WebSocket Events (Socket.IO)

### Authentication

Socket.IO middleware validates JWT on connection. Store `userId` in socket data.

### Events

| Event                    | Direction       | Payload                  |
| ------------------------ | --------------- | ------------------------ |
| `friend_request:send`    | server → client | `{ request }`            |
| `friend_request:accepted`| server → client | `{ friendship }`         |
| `friend_request:declined`| server → client | `{ requestId }`         |
| `notification:new`       | server → client | `{ notification }`       |
| `notification:read`      | server → client | `{ notificationId }`     |
| `presence:online`        | server → client | `{ userId }`            |
| `presence:offline`       | server → client | `{ userId }`            |

### Rooms

- Each user joins a personal room: `user:${userId}` — for targeted notifications
- Each user joins rooms for each friend — for online status broadcast
- On connect: join own room, join friend rooms, broadcast online
- On disconnect: broadcast offline

### Integration with REST

Every REST endpoint that creates a social event (friend request, reaction, comment) will also emit the corresponding Socket.IO event.

Example flow:

```
User A reacts to User B's post
  → REST:  POST /posts/:id/reactions (creates Reaction + Notification rows)
  → Socket: io.to("user:${B}").emit("notification:new", notification)
```

---

## 5. Key Design Decisions for Scale

| Decision               | Implementation                                                                                          |
| ---------------------- | ------------------------------------------------------------------------------------------------------- |
| **Cursor pagination**  | Use Prisma's `cursor` + `skip:1` on `id`/`createdAt`. O(1) seek regardless of dataset size.            |
| **Soft deletes**       | `deletedAt` timestamp on Post/Comment. Prisma Client Extension auto-filters deleted records.            |
| **Feed query**         | `WHERE deletedAt IS NULL AND visibility = 'PUBLIC'` sorted by `createdAt DESC`. Composite indexes handle this. |
| **Notification polymorphism** | Discriminated columns (`entityType` + `entityId`) — standard pattern, FK enforced at app level.  |
| **Image uploads**      | Client gets presigned URL → uploads directly to S3 → server never touches the file. Saves bandwidth.    |
| **Story cleanup**      | `node-cron` runs hourly: `DELETE FROM Story WHERE createdAt < now() - interval '24 hours'`              |
| **Friend queries**     | `Friendship` table with ordered `user1Id`/`user2Id` — single unique index covers both directions.       |
| **Reaction uniqueness**| Composite unique constraint: `[postId, userId, type]` — DB-level enforcement, no duplicate reactions.   |

---

## 6. Security & Middleware Pipeline

```
Request
  → helmet            (security headers)
  → cors              (allow frontend origin only)
  → rateLimit         (per-route limits: 100/min general, 10/min auth)
  → authenticate      (verify access token from Authorization header)
  → validate          (zod schemas for body/params/query)
  → controller        (business logic)
  → service           (data operations)
  → prisma            (database)
```

- **Password:** bcrypt with 12 salt rounds
- **Refresh tokens:** Stored hashed in DB, rotated on use, httpOnly cookie, 7-day expiry
- **Access tokens:** Short-lived (15 min), sent in Authorization header
- **Environment:** `.env` validated with zod at startup — fail fast if missing

---

## 7. Key Files to Create

| File                                  | Purpose                                      |
| ------------------------------------- | -------------------------------------------- |
| `prisma/schema.prisma`                | Full database schema                         |
| `src/lib/errors.ts`                   | `ApiError` class with status codes           |
| `src/lib/asyncHandler.ts`             | `wrap(fn)` that catches async errors         |
| `src/lib/jwt.ts`                      | `signAccess`, `signRefresh`, `verifyRefresh` |
| `src/lib/pagination.ts`               | Cursor pagination helper                     |
| `src/config/database.ts`              | Prisma singleton                             |
| `src/config/env.ts`                   | Zod env validation                           |
| `src/config/s3.ts`                    | S3 client (abstracted endpoint)              |
| `src/middleware/authenticate.ts`      | JWT verification middleware                  |
| `src/middleware/validate.ts`          | Zod validation middleware                    |
| `src/middleware/errorHandler.ts`      | Global error handler                         |
| `src/socket/index.ts`                 | Socket.IO server                             |
| `src/socket/authenticate.ts`          | Socket JWT middleware                        |
| `src/app.ts`                          | Express app setup                            |
| `src/server.ts`                       | HTTP + Socket.IO entry point                 |
| `src/jobs/storyCleanup.ts`            | Cron job for expired stories                 |

---

## 8. Implementation Order

| Phase | Modules                       | Dependencies       |
| ----- | ----------------------------- | ------------------ |
| 1     | Project setup, Prisma schema, Auth | None           |
| 2     | Users, Upload (S3)            | Auth               |
| 3     | Posts (CRUD + feed)           | Users              |
| 4     | Comments + Replies            | Posts              |
| 5     | Reactions                     | Posts, Comments    |
| 6     | Stories + cleanup job         | Users              |
| 7     | Friend Requests + Friends + Socket.IO setup | Auth, Users |
| 8     | Notifications + Socket.IO events | All above      |
| 9     | Events                        | Auth, Users        |
| 10    | Search                        | All above          |

---

## 9. Index Strategy (PostgreSQL)

### Critical Indexes

| Table          | Index                                         | Purpose                                |
| -------------- | --------------------------------------------- | -------------------------------------- |
| `Post`         | `[authorId, createdAt(sort: Desc)]`           | User's posts in chronological order    |
| `Post`         | `[createdAt(sort: Desc)]`                     | Global feed sorting                    |
| `Post`         | `[visibility, createdAt(sort: Desc)]`         | Feed filtered by visibility            |
| `Post`         | `[deletedAt]`                                 | Soft-delete filter                     |
| `Comment`      | `[postId, createdAt(sort: Desc)]`             | Comments per post, newest first        |
| `Comment`      | `[parentId]`                                  | Reply lookups                          |
| `Reaction`     | `[postId, type]`                              | Count reactions by type on a post      |
| `Reaction`     | `[postId, userId]`                            | Check if user reacted to a post        |
| `Story`        | `[createdAt(sort: Desc)]`                     | Cleanup job: delete expired stories    |
| `FriendRequest`| `[receiverId, status]`                        | Pending requests inbox                 |
| `Friendship`   | `[user1Id]` / `[user2Id]`                     | Friend lookups from either side        |
| `Notification` | `[userId, isRead, createdAt(sort: Desc)]`     | Unread notification feed               |
| `Event`        | `[startDate(sort: Desc)]`                     | Upcoming events                        |

### Performance Rules

- **Index every foreign key column** — Prisma does NOT auto-create FK indexes on PostgreSQL
- **Composite index order:** equality fields first, range/sort fields last
- **Cursor pagination:** always order by indexed columns
- **Use `CONCURRENTLY`** for adding indexes on large existing tables

---

## 10. Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/buddyscript?schema=public"

# JWT
JWT_ACCESS_SECRET="your-access-secret-min-32-chars"
JWT_REFRESH_SECRET="your-refresh-secret-min-32-chars"
JWT_ACCESS_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# S3 (works with AWS S3, MinIO, DigitalOcean Spaces, etc.)
S3_ENDPOINT="https://s3.amazonaws.com"
S3_BUCKET="buddyscript-uploads"
S3_REGION="us-east-1"
S3_ACCESS_KEY="your-access-key"
S3_SECRET_KEY="your-secret-key"
S3_PUBLIC_URL="https://your-bucket.s3.amazonaws.com"

# Server
PORT=3000
NODE_ENV=development
CORS_ORIGIN="http://localhost:5173"

# SMTP (for password reset emails)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
```
