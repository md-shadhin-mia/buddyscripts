import { z } from "zod"

export const imageUrlSchema = z.union([z.string().url(), z.string().startsWith("/")])

export const mediaItemSchema = z.object({
  url: z.string(),
  type: z.enum(["image", "video"]),
})

export const createPostSchema = z.object({
  content: z.string().min(1).max(5000),
  imageUrl: imageUrlSchema.optional(),
  media: z.array(mediaItemSchema).optional(),
  visibility: z.enum(["PUBLIC", "FRIENDS", "PRIVATE"]).default("PUBLIC"),
})

export const updatePostSchema = z.object({
  content: z.string().min(1).max(5000).optional(),
  imageUrl: imageUrlSchema.optional(),
  visibility: z.enum(["PUBLIC", "FRIENDS", "PRIVATE"]).optional(),
})
