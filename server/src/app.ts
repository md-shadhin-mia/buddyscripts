import express from "express"
import helmet from "helmet"
import cors from "cors"
import cookieParser from "cookie-parser"
import { env } from "./config/env"
import authRoutes from "./modules/auth/auth.routes"
import usersRoutes from "./modules/users/users.routes"
import postsRoutes from "./modules/posts/posts.routes"
import commentsRoutes from "./modules/comments/comments.routes"
import reactionsRoutes from "./modules/reactions/reactions.routes"
import storiesRoutes from "./modules/stories/stories.routes"
import friendsRoutes from "./modules/friends/friends.routes"
import friendRequestsRoutes from "./modules/friends/friend-requests.routes"
import notificationsRoutes from "./modules/notifications/notifications.routes"
import eventsRoutes from "./modules/events/events.routes"
import uploadRoutes from "./modules/upload/upload.routes"
import searchRoutes from "./modules/search/search.routes"
import { errorHandler } from "./middleware/errorHandler"
import { asyncHandler } from "./lib/asyncHandler"
import * as uploadController from "./modules/upload/upload.controller"

const app = express()

app.use(helmet())
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }))
app.use(express.json())
app.use(cookieParser())

app.use("/api/auth", authRoutes)
app.use("/api/users", usersRoutes)
app.use("/api/posts", postsRoutes)
app.use("/api/posts", commentsRoutes)
app.use("/api", reactionsRoutes)
app.use("/api/stories", storiesRoutes)
app.use("/api/friends", friendsRoutes)
app.use("/api/friend-requests", friendRequestsRoutes)
app.use("/api/notifications", notificationsRoutes)
app.use("/api/events", eventsRoutes)
app.use("/api/upload", uploadRoutes)
app.use("/api/search", searchRoutes)
app.get("/api/files/*key", asyncHandler(uploadController.serveFile))

app.use(errorHandler)

export default app
