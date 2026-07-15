import prisma from "../config/database"

export async function cleanExpiredStories() {
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000)

  const { count } = await prisma.story.deleteMany({
    where: { createdAt: { lt: cutoff } },
  })

  if (count > 0) {
    console.log(`[storyCleanup] Deleted ${count} expired stories`)
  }
}
