import { Request, Response } from "express"
import * as friendsService from "./friends.service"

export async function sendFriendRequest(req: Request, res: Response) {
  const request = await friendsService.sendFriendRequest(req.user!.id, req.body.receiverId)
  res.status(201).json({ status: "success", data: request })
}

export async function acceptFriendRequest(req: Request<{ id: string }>, res: Response) {
  const friendship = await friendsService.acceptFriendRequest(req.user!.id, req.params.id)
  res.json({ status: "success", data: friendship })
}

export async function declineFriendRequest(req: Request<{ id: string }>, res: Response) {
  await friendsService.declineFriendRequest(req.user!.id, req.params.id)
  res.json({ status: "success", message: "Friend request declined" })
}

export async function getPendingRequests(req: Request, res: Response) {
  const requests = await friendsService.getPendingRequests(req.user!.id)
  res.json({ status: "success", data: requests })
}

export async function getSentRequests(req: Request, res: Response) {
  const requests = await friendsService.getSentRequests(req.user!.id)
  res.json({ status: "success", data: requests })
}

export async function cancelFriendRequest(req: Request<{ id: string }>, res: Response) {
  await friendsService.cancelFriendRequest(req.user!.id, req.params.id)
  res.json({ status: "success", message: "Request cancelled" })
}
