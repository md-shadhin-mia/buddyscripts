import { Router } from "express"
import * as notificationsController from "./notifications.controller"
import { authenticate } from "../../middleware/authenticate"
import { asyncHandler } from "../../lib/asyncHandler"

const router = Router()

router.get("/", authenticate, asyncHandler(notificationsController.getNotifications))
router.get("/unread-count", authenticate, asyncHandler(notificationsController.getUnreadCount))
router.put("/:id/read", authenticate, asyncHandler(notificationsController.markAsRead))
router.put("/read-all", authenticate, asyncHandler(notificationsController.markAllAsRead))

export default router
