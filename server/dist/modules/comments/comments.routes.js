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
const commentsController = __importStar(require("./comments.controller"));
const authenticate_1 = require("../../middleware/authenticate");
const validate_1 = require("../../middleware/validate");
const comments_validation_1 = require("./comments.validation");
const asyncHandler_1 = require("../../lib/asyncHandler");
const router = (0, express_1.Router)();
router.get("/:postId/comments", (0, asyncHandler_1.asyncHandler)(commentsController.getComments));
router.post("/:postId/comments", authenticate_1.authenticate, (0, validate_1.validate)(comments_validation_1.createCommentSchema), (0, asyncHandler_1.asyncHandler)(commentsController.createComment));
router.put("/:postId/comments/:id", authenticate_1.authenticate, (0, validate_1.validate)(comments_validation_1.updateCommentSchema), (0, asyncHandler_1.asyncHandler)(commentsController.updateComment));
router.delete("/:postId/comments/:id", authenticate_1.authenticate, (0, asyncHandler_1.asyncHandler)(commentsController.deleteComment));
router.post("/:postId/comments/:id/reply", authenticate_1.authenticate, (0, validate_1.validate)(comments_validation_1.replySchema), (0, asyncHandler_1.asyncHandler)(commentsController.replyToComment));
exports.default = router;
//# sourceMappingURL=comments.routes.js.map