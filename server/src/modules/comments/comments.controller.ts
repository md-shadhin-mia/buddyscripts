import { Request, Response } from "express"
import * as commentsService from "./comments.service"

export async function createComment(req: Request<{ postId: string }>, res: Response) {
  const comment = await commentsService.createComment(req.user!.id, req.params.postId, req.body)
  res.status(201).json({ status: "success", data: comment })
}

export async function getComments(req: Request<{ postId: string }>, res: Response) {
  const { cursor, take } = req.query as any
  const userId = req.user?.id
  const result = await commentsService.getComments(req.params.postId, { cursor, take: take ? Number(take) : undefined }, userId)
  res.json({ status: "success", data: result })
}

export async function updateComment(req: Request<{ id: string }>, res: Response) {
  const comment = await commentsService.updateComment(req.user!.id, req.params.id, req.body)
  res.json({ status: "success", data: comment })
}

export async function deleteComment(req: Request<{ id: string }>, res: Response) {
  await commentsService.deleteComment(req.user!.id, req.params.id)
  res.json({ status: "success", message: "Comment deleted" })
}

export async function replyToComment(req: Request<{ id: string }>, res: Response) {
  const reply = await commentsService.replyToComment(req.user!.id, req.params.id, req.body)
  res.status(201).json({ status: "success", data: reply })
}
