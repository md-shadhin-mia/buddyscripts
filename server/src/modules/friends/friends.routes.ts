import { Router } from "express"
import * as friendsController from "./friends.controller"
import { authenticate } from "../../middleware/authenticate"
import { validate } from "../../middleware/validate"
import { sendFriendRequestSchema } from "./friends.validation"
import { asyncHandler } from "../../lib/asyncHandler"

const router = Router()

router.get("/", authenticate, asyncHandler(friendsController.getFriends))
router.get("/suggestions", authenticate, asyncHandler(friendsController.getSuggestions))
router.delete("/:id", authenticate, asyncHandler(friendsController.unfriend))

export default router
