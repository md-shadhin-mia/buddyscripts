import { z } from "zod"

const mediaItemSchema = z.object({
  url: z.string(),
  type: z.enum(["image", "video"]),
})

export const createCommentSchema = z.object({
  content: z.string().min(1).max(2000),
  media: z.array(mediaItemSchema).optional(),
})

export const updateCommentSchema = z.object({
  content: z.string().min(1).max(2000),
})

export const replySchema = z.object({
  content: z.string().min(1).max(2000),
  media: z.array(mediaItemSchema).optional(),
})
