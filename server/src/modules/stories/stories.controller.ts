import { Request, Response } from "express"
import * as storiesService from "./stories.service"

export async function createStory(req: Request, res: Response) {
  const story = await storiesService.createStory(req.user!.id, req.body)
  res.status(201).json({ status: "success", data: story })
}

export async function getActiveStories(req: Request, res: Response) {
  const stories = await storiesService.getActiveStories(req.user!.id)
  res.json({ status: "success", data: stories })
}

export async function deleteStory(req: Request<{ id: string }>, res: Response) {
  await storiesService.deleteStory(req.user!.id, req.params.id)
  res.json({ status: "success", message: "Story deleted" })
}

export async function viewStory(req: Request<{ id: string }>, res: Response) {
  await storiesService.viewStory(req.user!.id, req.params.id)
  res.json({ status: "success", message: "Story viewed" })
}
