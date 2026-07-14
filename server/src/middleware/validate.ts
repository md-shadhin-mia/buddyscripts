import { Request, Response, NextFunction } from "express"
import { ZodSchema } from "zod"
import { ApiError } from "../lib/errors"

export function validate(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
      const messages = result.error.issues.map(
        (e: any) => `${e.path.join(".")}: ${e.message}`
      )
      throw ApiError.badRequest(messages.join("; "))
    }
    req.body = result.data
    next()
  }
}
