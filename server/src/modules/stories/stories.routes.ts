import { Router } from "express"
import * as storiesController from "./stories.controller"
import { authenticate } from "../../middleware/authenticate"
import { validate } from "../../middleware/validate"
import { createStorySchema } from "./stories.validation"
import { asyncHandler } from "../../lib/asyncHandler"

const router = Router()

router.get("/", authenticate, asyncHandler(storiesController.getActiveStories))
router.post("/", authenticate, validate(createStorySchema), asyncHandler(storiesController.createStory))
router.delete("/:id", authenticate, asyncHandler(storiesController.deleteStory))
router.post("/:id/view", authenticate, asyncHandler(storiesController.viewStory))

export default router
