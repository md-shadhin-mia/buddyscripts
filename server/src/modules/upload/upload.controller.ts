import { Request, Response } from "express"
import * as uploadService from "./upload.service"

export async function uploadFile(req: Request, res: Response) {
  const file = req.file
  if (!file) {
    res.status(400).json({ status: "error", message: "No file provided" })
    return
  }
  const result = await uploadService.uploadFile(req.user!.id, {
    buffer: file.buffer,
    originalname: file.originalname,
    mimetype: file.mimetype,
  })
  res.json({ status: "success", data: result })
}

export async function serveFile(req: Request, res: Response) {
  const rawKey = req.params.key
  const key = Array.isArray(rawKey) ? rawKey.join("/") : rawKey
  if (!key) {
    res.status(400).json({ status: "error", message: "No file key provided" })
    return
  }
  try {
    const { getFileStream } = await import("../../config/s3")
    const response = await getFileStream(key)
    const stream = response.Body as import("stream").Readable

    if (response.ContentType) {
      res.setHeader("Content-Type", response.ContentType)
    }
    if (response.ContentLength) {
      res.setHeader("Content-Length", response.ContentLength)
    }

    res.setHeader("Cache-Control", "public, max-age=31536000, immutable")
    stream.pipe(res)
  } catch {
    res.status(404).json({ status: "error", message: "File not found" })
  }
}
