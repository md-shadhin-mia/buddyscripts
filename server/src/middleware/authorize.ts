import { Request, Response, NextFunction } from "express"
import { ApiError } from "../lib/errors"

export function authorizeOwnership<T extends { userId?: string; authorId?: string }>(
  getResource: (req: Request) => Promise<T | null>,
) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw ApiError.unauthorized()
    }

    const resource = await getResource(req)
    if (!resource) {
      throw ApiError.notFound("Resource not found")
    }

    const ownerId = (resource as any).userId ?? (resource as any).authorId
    if (ownerId !== req.user.id) {
      throw ApiError.forbidden("You do not own this resource")
    }

    next()
  }
}
