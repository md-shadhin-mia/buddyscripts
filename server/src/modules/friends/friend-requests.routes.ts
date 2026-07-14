import { Router } from "express"
import * as friendRequestsController from "./friend-requests.controller"
import { authenticate } from "../../middleware/authenticate"
import { validate } from "../../middleware/validate"
import { sendFriendRequestSchema } from "./friends.validation"
import { asyncHandler } from "../../lib/asyncHandler"

const router = Router()

router.post("/", authenticate, validate(sendFriendRequestSchema), asyncHandler(friendRequestsController.sendFriendRequest))
router.put("/:id/accept", authenticate, asyncHandler(friendRequestsController.acceptFriendRequest))
router.put("/:id/decline", authenticate, asyncHandler(friendRequestsController.declineFriendRequest))
router.get("/", authenticate, asyncHandler(friendRequestsController.getPendingRequests))
router.get("/sent", authenticate, asyncHandler(friendRequestsController.getSentRequests))
router.delete("/:id", authenticate, asyncHandler(friendRequestsController.cancelFriendRequest))

export default router
