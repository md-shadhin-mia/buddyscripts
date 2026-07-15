"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replySchema = exports.updateCommentSchema = exports.createCommentSchema = void 0;
const zod_1 = require("zod");
const mediaItemSchema = zod_1.z.object({
    url: zod_1.z.string(),
    type: zod_1.z.enum(["image", "video"]),
});
exports.createCommentSchema = zod_1.z.object({
    content: zod_1.z.string().min(1).max(2000),
    media: zod_1.z.array(mediaItemSchema).optional(),
});
exports.updateCommentSchema = zod_1.z.object({
    content: zod_1.z.string().min(1).max(2000),
});
exports.replySchema = zod_1.z.object({
    content: zod_1.z.string().min(1).max(2000),
    media: zod_1.z.array(mediaItemSchema).optional(),
});
//# sourceMappingURL=comments.validation.js.map