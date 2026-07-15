import { Request, Response } from "express"
import * as notificationsService from "./notifications.service"
import { getIO } from "../../socket"

export async function getNotifications(req: Request, res: Response) {
  const { cursor, take } = req.query as any
  const result = await notificationsService.getNotifications(req.user!.id, { cursor, take: take ? Number(take) : undefined })
  res.json({ status: "success", data: result })
}

export async function getUnreadCount(req: Request, res: Response) {
  const count = await notificationsService.getUnreadCount(req.user!.id)
  res.json({ status: "success", data: { count } })
}

export async function markAsRead(req: Request<{ id: string }>, res: Response) {
  await notificationsService.markAsRead(req.user!.id, req.params.id)
  getIO()?.to(`user:${req.user!.id}`).emit("notification:read", { notificationId: req.params.id })
  res.json({ status: "success", message: "Notification marked as read" })
}

export async function markAllAsRead(req: Request, res: Response) {
  await notificationsService.markAllAsRead(req.user!.id)
  res.json({ status: "success", message: "All notifications marked as read" })
}
