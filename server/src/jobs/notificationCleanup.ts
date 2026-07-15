import prisma from "../config/database"

export async function cleanOldNotifications() {
  const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

  const { count } = await prisma.notification.deleteMany({
    where: {
      isRead: true,
      createdAt: { lt: cutoff },
    },
  })

  if (count > 0) {
    console.log(`[notificationCleanup] Deleted ${count} old read notifications`)
  }
}
