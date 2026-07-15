import { Router } from "express"
import * as searchController from "./search.controller"
import { authenticate } from "../../middleware/authenticate"
import { asyncHandler } from "../../lib/asyncHandler"

const router = Router()

router.get("/", authenticate, asyncHandler(searchController.search))

export default router
