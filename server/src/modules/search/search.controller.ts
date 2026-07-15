import { Request, Response } from "express"
import * as searchService from "./search.service"

export async function search(req: Request, res: Response) {
  const q = req.query.q as string
  const type = req.query.type as string | undefined
  const results = await searchService.search(q, type)
  res.json({ status: "success", data: results })
}
