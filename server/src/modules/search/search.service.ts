import prisma from "../../config/database"

export async function search(query: string, type?: string) {
  const types = type?.split(",").map((t) => t.trim()) ?? ["users", "posts", "events"]

  const results: Record<string, any[]> = {}

  if (types.includes("users")) {
    results.users = await prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
        ],
      },
      select: { id: true, name: true, avatar: true, bio: true },
      take: 20,
    })
  }

  if (types.includes("posts")) {
    results.posts = await prisma.post.findMany({
      where: {
        deletedAt: null,
        content: { contains: query, mode: "insensitive" },
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        author: { select: { id: true, name: true, avatar: true } },
      },
      take: 20,
      orderBy: { createdAt: "desc" },
    })
  }

  if (types.includes("events")) {
    results.events = await prisma.event.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        title: true,
        description: true,
        startDate: true,
        location: true,
        creator: { select: { id: true, name: true, avatar: true } },
      },
      take: 20,
      orderBy: { startDate: "asc" },
    })
  }

  return results
}
