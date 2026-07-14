import bcrypt from "bcryptjs"
import crypto from "crypto"
import prisma from "../../config/database"
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../../lib/jwt"
import { ApiError } from "../../lib/errors"

const SALT_ROUNDS = 12

interface RegisterInput {
  email: string
  password: string
  name: string
}

interface LoginInput {
  email: string
  password: string
}

function generateJti(): string {
  return crypto.randomUUID()
}

export async function register(input: RegisterInput) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } })
  if (existing) {
    throw ApiError.conflict("Email already in use")
  }

  const hashedPassword = await bcrypt.hash(input.password, SALT_ROUNDS)

  const user = await prisma.user.create({
    data: {
      email: input.email,
      password: hashedPassword,
      name: input.name,
    },
    select: { id: true, email: true, name: true, avatar: true, createdAt: true },
  })

  return { user }
}

export async function login(input: LoginInput) {
  const user = await prisma.user.findUnique({ where: { email: input.email } })
  if (!user) {
    throw ApiError.unauthorized("Invalid email or password")
  }

  const valid = await bcrypt.compare(input.password, user.password)
  if (!valid) {
    throw ApiError.unauthorized("Invalid email or password")
  }

  const accessToken = signAccessToken(user.id)
  const jti = generateJti()
  const refreshToken = signRefreshToken(user.id, jti)
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

  await prisma.refreshToken.create({
    data: {
      token: await bcrypt.hash(refreshToken, 10),
      userId: user.id,
      expiresAt,
    },
  })

  return {
    user: { id: user.id, email: user.email, name: user.name, avatar: user.avatar },
    accessToken,
    refreshToken,
  }
}

export async function refresh(token: string) {
  let payload: { sub: string; jti: string }
  try {
    payload = verifyRefreshToken(token)
  } catch {
    throw ApiError.unauthorized("Invalid or expired refresh token")
  }

  const storedTokens = await prisma.refreshToken.findMany({
    where: { userId: payload.sub },
  })

  let matchedToken: typeof storedTokens[number] | undefined
  for (const st of storedTokens) {
    const ok = await bcrypt.compare(token, st.token)
    if (ok) {
      matchedToken = st
      break
    }
  }

  if (!matchedToken) {
    throw ApiError.unauthorized("Refresh token not found")
  }

  await prisma.refreshToken.delete({ where: { id: matchedToken.id } })

  const accessToken = signAccessToken(payload.sub)
  const newJti = generateJti()
  const refreshToken = signRefreshToken(payload.sub, newJti)
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

  await prisma.refreshToken.create({
    data: {
      token: await bcrypt.hash(refreshToken, 10),
      userId: payload.sub,
      expiresAt,
    },
  })

  return { accessToken, refreshToken }
}

export async function logout(token: string) {
  const storedTokens = await prisma.refreshToken.findMany()

  for (const st of storedTokens) {
    const ok = await bcrypt.compare(token, st.token)
    if (ok) {
      await prisma.refreshToken.delete({ where: { id: st.id } })
      return
    }
  }
}
