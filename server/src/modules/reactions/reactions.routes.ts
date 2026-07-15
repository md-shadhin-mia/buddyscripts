import { Router } from "express"
import * as reactionsController from "./reactions.controller"
import { authenticate } from "../../middleware/authenticate"
import { validate } from "../../middleware/validate"
import { createReactionSchema } from "./reactions.validation"
import { asyncHandler } from "../../lib/asyncHandler"

const router = Router()

router.post("/posts/:postId/reactions", authenticate, validate(createReactionSchema), asyncHandler(reactionsController.reactToPost))
router.delete("/posts/:postId/reactions", authenticate, asyncHandler(reactionsController.removePostReaction))
router.get("/posts/:postId/reactions", asyncHandler(reactionsController.getPostReactions))
router.post("/comments/:commentId/reactions", authenticate, validate(createReactionSchema), asyncHandler(reactionsController.reactToComment))
router.delete("/comments/:commentId/reactions", authenticate, asyncHandler(reactionsController.removeCommentReaction))
router.get("/comments/:commentId/reactions", asyncHandler(reactionsController.getCommentReactions))

export default router
