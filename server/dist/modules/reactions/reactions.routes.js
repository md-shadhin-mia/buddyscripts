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
const reactionsController = __importStar(require("./reactions.controller"));
const authenticate_1 = require("../../middleware/authenticate");
const validate_1 = require("../../middleware/validate");
const reactions_validation_1 = require("./reactions.validation");
const asyncHandler_1 = require("../../lib/asyncHandler");
const router = (0, express_1.Router)();
router.post("/posts/:postId/reactions", authenticate_1.authenticate, (0, validate_1.validate)(reactions_validation_1.createReactionSchema), (0, asyncHandler_1.asyncHandler)(reactionsController.reactToPost));
router.delete("/posts/:postId/reactions", authenticate_1.authenticate, (0, asyncHandler_1.asyncHandler)(reactionsController.removePostReaction));
router.get("/posts/:postId/reactions", (0, asyncHandler_1.asyncHandler)(reactionsController.getPostReactions));
router.post("/comments/:commentId/reactions", authenticate_1.authenticate, (0, validate_1.validate)(reactions_validation_1.createReactionSchema), (0, asyncHandler_1.asyncHandler)(reactionsController.reactToComment));
router.delete("/comments/:commentId/reactions", authenticate_1.authenticate, (0, asyncHandler_1.asyncHandler)(reactionsController.removeCommentReaction));
router.get("/comments/:commentId/reactions", (0, asyncHandler_1.asyncHandler)(reactionsController.getCommentReactions));
exports.default = router;
//# sourceMappingURL=reactions.routes.js.map