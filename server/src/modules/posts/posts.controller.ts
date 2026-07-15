import { Request, Response } from "express"
import * as postsService from "./posts.service"

export async function getFeed(req: Request, res: Response) {
  const { cursor, take } = req.query as any
  const result = await postsService.getFeed(req.user!.id, { cursor, take: take ? Number(take) : undefined })
  res.json({ status: "success", data: result })
}

export async function createPost(req: Request, res: Response) {
  const post = await postsService.createPost(req.user!.id, req.body)
  res.status(201).json({ status: "success", data: post })
}

export async function getPost(req: Request<{ id: string }>, res: Response) {
  const post = await postsService.getPost(req.params.id)
  res.json({ status: "success", data: post })
}

export async function updatePost(req: Request<{ id: string }>, res: Response) {
  const post = await postsService.updatePost(req.user!.id, req.params.id, req.body)
  res.json({ status: "success", data: post })
}

export async function deletePost(req: Request<{ id: string }>, res: Response) {
  await postsService.deletePost(req.user!.id, req.params.id)
  res.json({ status: "success", message: "Post deleted" })
}

export async function savePost(req: Request<{ id: string }>, res: Response) {
  await postsService.savePost(req.user!.id, req.params.id)
  res.status(201).json({ status: "success", message: "Post saved" })
}

export async function unsavePost(req: Request<{ id: string }>, res: Response) {
  await postsService.unsavePost(req.user!.id, req.params.id)
  res.json({ status: "success", message: "Post unsaved" })
}

export async function getSavedPosts(req: Request, res: Response) {
  const { cursor, take } = req.query as any
  const result = await postsService.getSavedPosts(req.user!.id, { cursor, take: take ? Number(take) : undefined })
  res.json({ status: "success", data: result })
}
