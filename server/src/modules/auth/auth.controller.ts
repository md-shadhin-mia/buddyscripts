import { Request, Response } from "express"
import * as authService from "./auth.service"
import { env } from "../../config/env"

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/api/auth",
  maxAge: 7 * 24 * 60 * 60 * 1000,
}

export async function register(req: Request, res: Response) {
  const result = await authService.register(req.body)
  res.status(201).json({ status: "success", data: result.user })
}

export async function login(req: Request, res: Response) {
  const result = await authService.login(req.body)
  res.cookie("refreshToken", result.refreshToken, REFRESH_COOKIE_OPTIONS)
  res.json({
    status: "success",
    data: {
      user: result.user,
      accessToken: result.accessToken,
    },
  })
}

export async function refresh(req: Request, res: Response) {
  const token = req.cookies?.refreshToken
  if (!token) {
    res.status(401).json({ status: "error", message: "Refresh token missing" })
    return
  }
  const result = await authService.refresh(token)
  res.cookie("refreshToken", result.refreshToken, REFRESH_COOKIE_OPTIONS)
  res.json({
    status: "success",
    data: { accessToken: result.accessToken },
  })
}

export async function logout(req: Request, res: Response) {
  const token = req.cookies?.refreshToken
  if (token) {
    await authService.logout(token)
  }
  res.clearCookie("refreshToken", { path: "/api/auth" })
  res.json({ status: "success", message: "Logged out" })
}
