import { Router } from "express"
import * as authController from "./auth.controller"
import { validate } from "../../middleware/validate"
import { registerSchema, loginSchema } from "./auth.validation"
import { asyncHandler } from "../../lib/asyncHandler"

const router = Router()

router.post("/register", validate(registerSchema), asyncHandler(authController.register))
router.post("/login", validate(loginSchema), asyncHandler(authController.login))
router.post("/refresh", asyncHandler(authController.refresh))
router.post("/logout", asyncHandler(authController.logout))

export default router
