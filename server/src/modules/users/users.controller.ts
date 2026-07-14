import { Request, Response } from "express"
import * as usersService from "./users.service"

export async function getMe(req: Request, res: Response) {
  const user = await usersService.getProfile(req.user!.id)
  res.json({ status: "success", data: user })
}

export async function updateMe(req: Request, res: Response) {
  const user = await usersService.updateProfile(req.user!.id, req.body)
  res.json({ status: "success", data: user })
}

export async function getUserById(req: Request<{ id: string }>, res: Response) {
  const user = await usersService.getProfile(req.params.id)
  res.json({ status: "success", data: user })
}

export async function getUserPosts(req: Request<{ id: string }>, res: Response) {
  const { cursor, take } = req.query as any
  const result = await usersService.getUserPosts(req.params.id, { cursor, take: take ? Number(take) : undefined })
  res.json({ status: "success", data: result })
}
