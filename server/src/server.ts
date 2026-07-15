import { createServer } from "http"
import cron from "node-cron"
import app from "./app"
import { env } from "./config/env"
import { initSocket } from "./socket"
import { cleanExpiredStories } from "./jobs/storyCleanup"
import { cleanOldNotifications } from "./jobs/notificationCleanup"

const httpServer = createServer(app)

initSocket(httpServer)

cron.schedule("0 * * * *", () => {
  cleanExpiredStories()
})

cron.schedule("0 3 * * *", () => {
  cleanOldNotifications()
})

const host = process.env.HOST || "0.0.0.0"

httpServer.listen(env.PORT, host, () => {
  console.log(`Server running on http://${host}:${env.PORT} in ${env.NODE_ENV} mode`)
})

export default httpServer
