import { describe, it, expect, vi, beforeEach } from "vitest"

vi.mock("../../../config/s3", () => ({
  uploadToS3: vi.fn().mockResolvedValue(undefined),
}))

const mockUploadToS3 = vi.mocked((await import("../../../config/s3")).uploadToS3)

const userId = "user-1"

describe("UploadService", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("uploadFile", () => {
    it("uploads file to S3 and returns internal API URL", async () => {
      const { uploadFile } = await import("../upload.service")
      const result = await uploadFile(userId, {
        buffer: Buffer.from("test"),
        originalname: "photo.jpg",
        mimetype: "image/jpeg",
      })

      expect(result.key).toMatch(new RegExp(`^uploads/${userId}/[\\w-]+-photo\\.jpg$`))
      expect(result.url).toBe(`/api/files/${result.key}`)
      expect(mockUploadToS3).toHaveBeenCalledWith(
        expect.stringMatching(new RegExp(`^uploads/${userId}/`)),
        expect.any(Buffer),
        "image/jpeg",
      )
    })
  })
})
