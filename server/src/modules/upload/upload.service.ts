import { randomUUID } from "crypto"
import { uploadToS3 } from "../../config/s3"

export async function uploadFile(
  userId: string,
  file: { buffer: Buffer; originalname: string; mimetype: string }
) {
  const key = `uploads/${userId}/${randomUUID()}-${file.originalname}`
  await uploadToS3(key, file.buffer, file.mimetype)
  return { key, url: `/api/files/${key}` }
}
