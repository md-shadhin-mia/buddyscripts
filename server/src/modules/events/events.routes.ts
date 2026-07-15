import { Router } from "express"
import * as eventsController from "./events.controller"
import { authenticate } from "../../middleware/authenticate"
import { validate } from "../../middleware/validate"
import { createEventSchema, updateEventSchema, rsvpSchema } from "./events.validation"
import { asyncHandler } from "../../lib/asyncHandler"

const router = Router()

router.get("/", asyncHandler(eventsController.getEvents))
router.post("/", authenticate, validate(createEventSchema), asyncHandler(eventsController.createEvent))
router.get("/:id", asyncHandler(eventsController.getEvent))
router.put("/:id", authenticate, validate(updateEventSchema), asyncHandler(eventsController.updateEvent))
router.delete("/:id", authenticate, asyncHandler(eventsController.deleteEvent))
router.post("/:id/rsvp", authenticate, validate(rsvpSchema), asyncHandler(eventsController.rsvp))

export default router
