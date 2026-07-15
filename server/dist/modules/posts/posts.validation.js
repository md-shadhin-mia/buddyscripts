"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePostSchema = exports.createPostSchema = exports.mediaItemSchema = exports.imageUrlSchema = void 0;
const zod_1 = require("zod");
exports.imageUrlSchema = zod_1.z.union([zod_1.z.string().url(), zod_1.z.string().startsWith("/")]);
exports.mediaItemSchema = zod_1.z.object({
    url: zod_1.z.string(),
    type: zod_1.z.enum(["image", "video"]),
});
exports.createPostSchema = zod_1.z.object({
    content: zod_1.z.string().min(1).max(5000),
    imageUrl: exports.imageUrlSchema.optional(),
    media: zod_1.z.array(exports.mediaItemSchema).optional(),
    visibility: zod_1.z.enum(["PUBLIC", "FRIENDS", "PRIVATE"]).default("PUBLIC"),
});
exports.updatePostSchema = zod_1.z.object({
    content: zod_1.z.string().min(1).max(5000).optional(),
    imageUrl: exports.imageUrlSchema.optional(),
    visibility: zod_1.z.enum(["PUBLIC", "FRIENDS", "PRIVATE"]).optional(),
});
//# sourceMappingURL=posts.validation.js.map