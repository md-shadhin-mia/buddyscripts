import { Request, Response } from "express"
import * as eventsService from "./events.service"

export async function createEvent(req: Request, res: Response) {
  const event = await eventsService.createEvent(req.user!.id, req.body)
  res.status(201).json({ status: "success", data: event })
}

export async function getEvents(_req: Request, res: Response) {
  const events = await eventsService.getEvents()
  res.json({ status: "success", data: events })
}

export async function getEvent(req: Request<{ id: string }>, res: Response) {
  const event = await eventsService.getEvent(req.params.id)
  res.json({ status: "success", data: event })
}

export async function updateEvent(req: Request<{ id: string }>, res: Response) {
  const event = await eventsService.updateEvent(req.user!.id, req.params.id, req.body)
  res.json({ status: "success", data: event })
}

export async function deleteEvent(req: Request<{ id: string }>, res: Response) {
  await eventsService.deleteEvent(req.user!.id, req.params.id)
  res.json({ status: "success", message: "Event deleted" })
}

export async function rsvp(req: Request<{ id: string }>, res: Response) {
  const attendee = await eventsService.rsvp(req.user!.id, req.params.id, req.body)
  res.json({ status: "success", data: attendee })
}
