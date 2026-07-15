import { z } from "zod"

const imageUrlSchema = z.union([z.string().url(), z.string().startsWith("/")])

export const createStorySchema = z.object({
  imageUrl: imageUrlSchema,
  content: z.string().max(500).optional(),
})
