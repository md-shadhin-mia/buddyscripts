import { Router } from "express"
import * as usersController from "./users.controller"
import { authenticate } from "../../middleware/authenticate"
import { validate } from "../../middleware/validate"
import { updateProfileSchema } from "./users.validation"
import { asyncHandler } from "../../lib/asyncHandler"

const router = Router()

router.get("/me", authenticate, asyncHandler(usersController.getMe))
router.put("/me", authenticate, validate(updateProfileSchema), asyncHandler(usersController.updateMe))
router.get("/:id", asyncHandler(usersController.getUserById))
router.get("/:id/posts", asyncHandler(usersController.getUserPosts))

export default router
