import { Request, Response } from "express"
import * as reactionsService from "./reactions.service"

export async function reactToPost(req: Request<{ postId: string }>, res: Response) {
  const reaction = await reactionsService.reactToPost(req.user!.id, req.params.postId, req.body)
  res.status(201).json({ status: "success", data: reaction })
}

export async function removePostReaction(req: Request<{ postId: string }>, res: Response) {
  await reactionsService.removePostReaction(req.user!.id, req.params.postId)
  res.json({ status: "success", message: "Reaction removed" })
}

export async function getPostReactions(req: Request<{ postId: string }>, res: Response) {
  const reactions = await reactionsService.getPostReactions(req.params.postId)
  res.json({ status: "success", data: reactions })
}

export async function reactToComment(req: Request<{ commentId: string }>, res: Response) {
  const reaction = await reactionsService.reactToComment(req.user!.id, req.params.commentId, req.body)
  res.status(201).json({ status: "success", data: reaction })
}

export async function removeCommentReaction(req: Request<{ commentId: string }>, res: Response) {
  await reactionsService.removeCommentReaction(req.user!.id, req.params.commentId)
  res.json({ status: "success", message: "Reaction removed" })
}

export async function getCommentReactions(req: Request<{ commentId: string }>, res: Response) {
  const reactions = await reactionsService.getCommentReactions(req.params.commentId)
  res.json({ status: "success", data: reactions })
}
