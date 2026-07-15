import { Socket } from "socket.io"
import { verifyAccessToken } from "../lib/jwt"

export function authenticateSocket(socket: Socket, next: (err?: Error) => void) {
  const token =
    socket.handshake.auth?.token ??
    socket.handshake.headers?.authorization?.replace("Bearer ", "")

  if (!token) return next(new Error("Authentication required"))

  try {
    const payload = verifyAccessToken(token)
    socket.data.userId = payload.sub
    next()
  } catch {
    next(new Error("Invalid token"))
  }
}
