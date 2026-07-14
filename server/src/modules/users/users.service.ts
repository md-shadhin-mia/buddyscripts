import prisma from "../../config/database"
import { ApiError } from "../../lib/errors"
import { paginate } from "../../lib/pagination"

interface UpdateProfileInput {
  name?: string
  bio?: string
}

const userSelect = {
  id: true,
  email: true,
  name: true,
  avatar: true,
  bio: true,
  createdAt: true,
} as const

export async function getProfile(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: userSelect,
  })
  if (!user) throw ApiError.notFound("User not found")
  return user
}

export async function updateProfile(id: string, input: UpdateProfileInput) {
  const user = await prisma.user.update({
    where: { id },
    data: input,
    select: userSelect,
  })
  return user
}

export async function getUserPosts(id: string, params: { cursor?: string; take?: number }) {
  const where = { authorId: id, deletedAt: null }
  const result = await paginate(prisma.post, { ...params, where })
  return result
}
