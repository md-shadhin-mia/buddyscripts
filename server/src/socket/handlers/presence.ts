import { Server, Socket } from "socket.io"
import prisma from "../../config/database"

export function registerPresence(io: Server, socket: Socket) {
  const userId = socket.data.userId as string

  socket.join(`user:${userId}`)

  prisma.friendship
    .findMany({
      where: {
        OR: [{ user1Id: userId }, { user2Id: userId }],
      },
      select: { user1Id: true, user2Id: true },
    })
    .then((friendships) => {
      const friendIds = friendships.map((f) =>
        f.user1Id === userId ? f.user2Id : f.user1Id,
      )

      friendIds.forEach((friendId) => {
        socket.join(`presence:${friendId}`)
      })

      friendIds.forEach((friendId) => {
        io.to(`user:${friendId}`).emit("presence:online", { userId })
      })
    })

  socket.on("disconnect", () => {
    io.to(`user:${userId}`).emit("presence:offline", { userId })
  })
}
