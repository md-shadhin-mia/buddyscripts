import { Router } from "express"
import * as postsController from "./posts.controller"
import { authenticate } from "../../middleware/authenticate"
import { validate } from "../../middleware/validate"
import { createPostSchema, updatePostSchema } from "./posts.validation"
import { asyncHandler } from "../../lib/asyncHandler"

const router = Router()

router.get("/", authenticate, asyncHandler(postsController.getFeed))
router.post("/", authenticate, validate(createPostSchema), asyncHandler(postsController.createPost))
router.get("/saved", authenticate, asyncHandler(postsController.getSavedPosts))
router.get("/:id", asyncHandler(postsController.getPost))
router.put("/:id", authenticate, validate(updatePostSchema), asyncHandler(postsController.updatePost))
router.delete("/:id", authenticate, asyncHandler(postsController.deletePost))
router.post("/:id/save", authenticate, asyncHandler(postsController.savePost))
router.delete("/:id/save", authenticate, asyncHandler(postsController.unsavePost))

export default router
