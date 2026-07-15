import { Request, Response, NextFunction } from "express"
import prisma from "../config/database"
import { verifyAccessToken } from "../lib/jwt"
import { ApiError } from "../lib/errors"

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string
        email: string
        name: string
        avatar: string | null
      }
    }
  }
}

export async function authenticate(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization
  if (!header || !header.startsWith("Bearer ")) {
    throw ApiError.unauthorized("Missing or invalid authorization header")
  }

  const token = header.split(" ")[1]
  let payload: { sub: string }
  try {
    payload = verifyAccessToken(token)
  } catch {
    throw ApiError.unauthorized("Invalid or expired access token")
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
    select: { id: true, email: true, name: true, avatar: true },
  })

  if (!user) {
    throw ApiError.unauthorized("User no longer exists")
  }

  req.user = user
  next()
}
