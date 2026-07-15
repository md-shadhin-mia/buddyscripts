"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const eventsController = __importStar(require("./events.controller"));
const authenticate_1 = require("../../middleware/authenticate");
const validate_1 = require("../../middleware/validate");
const events_validation_1 = require("./events.validation");
const asyncHandler_1 = require("../../lib/asyncHandler");
const router = (0, express_1.Router)();
router.get("/", (0, asyncHandler_1.asyncHandler)(eventsController.getEvents));
router.post("/", authenticate_1.authenticate, (0, validate_1.validate)(events_validation_1.createEventSchema), (0, asyncHandler_1.asyncHandler)(eventsController.createEvent));
router.get("/:id", (0, asyncHandler_1.asyncHandler)(eventsController.getEvent));
router.put("/:id", authenticate_1.authenticate, (0, validate_1.validate)(events_validation_1.updateEventSchema), (0, asyncHandler_1.asyncHandler)(eventsController.updateEvent));
router.delete("/:id", authenticate_1.authenticate, (0, asyncHandler_1.asyncHandler)(eventsController.deleteEvent));
router.post("/:id/rsvp", authenticate_1.authenticate, (0, validate_1.validate)(events_validation_1.rsvpSchema), (0, asyncHandler_1.asyncHandler)(eventsController.rsvp));
exports.default = router;
//# sourceMappingURL=events.routes.js.map