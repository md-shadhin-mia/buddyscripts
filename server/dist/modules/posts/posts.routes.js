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
const postsController = __importStar(require("./posts.controller"));
const authenticate_1 = require("../../middleware/authenticate");
const validate_1 = require("../../middleware/validate");
const posts_validation_1 = require("./posts.validation");
const asyncHandler_1 = require("../../lib/asyncHandler");
const router = (0, express_1.Router)();
router.get("/", authenticate_1.authenticate, (0, asyncHandler_1.asyncHandler)(postsController.getFeed));
router.post("/", authenticate_1.authenticate, (0, validate_1.validate)(posts_validation_1.createPostSchema), (0, asyncHandler_1.asyncHandler)(postsController.createPost));
router.get("/saved", authenticate_1.authenticate, (0, asyncHandler_1.asyncHandler)(postsController.getSavedPosts));
router.get("/:id", (0, asyncHandler_1.asyncHandler)(postsController.getPost));
router.put("/:id", authenticate_1.authenticate, (0, validate_1.validate)(posts_validation_1.updatePostSchema), (0, asyncHandler_1.asyncHandler)(postsController.updatePost));
router.delete("/:id", authenticate_1.authenticate, (0, asyncHandler_1.asyncHandler)(postsController.deletePost));
router.post("/:id/save", authenticate_1.authenticate, (0, asyncHandler_1.asyncHandler)(postsController.savePost));
router.delete("/:id/save", authenticate_1.authenticate, (0, asyncHandler_1.asyncHandler)(postsController.unsavePost));
exports.default = router;
//# sourceMappingURL=posts.routes.js.map