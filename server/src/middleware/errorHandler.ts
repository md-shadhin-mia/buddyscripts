import { Request, Response, NextFunction } from "express"
import { ApiError } from "../lib/errors"
import { env } from "../config/env"

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      status: "error",
      message: err.message,
      ...(env.NODE_ENV === "development" && { stack: err.stack }),
    })
    return
  }

  if (err.name === "PrismaClientKnownRequestError") {
    const prismaErr = err as any
    if (prismaErr.code === "P2002") {
      res.status(409).json({ status: "error", message: "Resource already exists" })
      return
    }
    if (prismaErr.code === "P2025") {
      res.status(404).json({ status: "error", message: "Resource not found" })
      return
    }
  }

  console.error("Unhandled error:", err)
  res.status(500).json({
    status: "error",
    message: "Internal server error",
    ...(env.NODE_ENV === "development" && { stack: err.stack }),
  })
}
