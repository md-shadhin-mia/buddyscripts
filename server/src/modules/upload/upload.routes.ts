import { Router } from "express"
import multer from "multer"
import * as uploadController from "./upload.controller"
import { authenticate } from "../../middleware/authenticate"
import { asyncHandler } from "../../lib/asyncHandler"

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } })

const router = Router()

router.post("/", authenticate, upload.single("file"), asyncHandler(uploadController.uploadFile))

export default router
