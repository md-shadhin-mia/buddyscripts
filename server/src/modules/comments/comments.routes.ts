import { Router } from "express"
import * as commentsController from "./comments.controller"
import { authenticate } from "../../middleware/authenticate"
import { validate } from "../../middleware/validate"
import { createCommentSchema, updateCommentSchema, replySchema } from "./comments.validation"
import { asyncHandler } from "../../lib/asyncHandler"

const router = Router()

router.get("/:postId/comments", asyncHandler(commentsController.getComments))
router.post("/:postId/comments", authenticate, validate(createCommentSchema), asyncHandler(commentsController.createComment))
router.put("/:postId/comments/:id", authenticate, validate(updateCommentSchema), asyncHandler(commentsController.updateComment))
router.delete("/:postId/comments/:id", authenticate, asyncHandler(commentsController.deleteComment))
router.post("/:postId/comments/:id/reply", authenticate, validate(replySchema), asyncHandler(commentsController.replyToComment))

export default router
