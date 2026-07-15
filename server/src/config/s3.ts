import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3"
import { env } from "./env"

const s3 = env.S3_ENDPOINT
  ? new S3Client({
      endpoint: env.S3_ENDPOINT,
      region: env.S3_REGION ?? "us-east-1",
      credentials: {
        accessKeyId: env.S3_ACCESS_KEY ?? "",
        secretAccessKey: env.S3_SECRET_KEY ?? "",
      },
      forcePathStyle: true,
    })
  : null

export async function uploadToS3(
  key: string,
  buffer: Buffer,
  contentType: string
): Promise<void> {
  if (!s3) throw new Error("S3 not configured")

  const command = new PutObjectCommand({
    Bucket: env.S3_BUCKET!,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  })

  await s3.send(command)
}

export async function getFileStream(key: string) {
  if (!s3) throw new Error("S3 not configured")

  const command = new GetObjectCommand({
    Bucket: env.S3_BUCKET!,
    Key: key,
  })

  return s3.send(command)
}
