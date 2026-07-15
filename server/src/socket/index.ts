import { Server as HttpServer } from "http"
import { Server as SocketIOServer } from "socket.io"
import { env } from "../config/env"
import { authenticateSocket } from "./authenticate"
import { registerPresence } from "./handlers/presence"

let io: SocketIOServer | null = null

export function initSocket(httpServer: HttpServer) {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: env.CORS_ORIGIN,
      credentials: true,
    },
  })

  io.use(authenticateSocket)

  io.on("connection", (socket) => {
    registerPresence(io!, socket)
  })

  return io
}

export function getIO(): SocketIOServer | null {
  return io
}
