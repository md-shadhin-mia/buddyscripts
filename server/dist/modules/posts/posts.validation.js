"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePostSchema = exports.createPostSchema = void 0;
const zod_1 = require("zod");
exports.createPostSchema = zod_1.z.object({
    content: zod_1.z.string().min(1).max(5000),
    imageUrl: zod_1.z.string().url().optional(),
    visibility: zod_1.z.enum(["PUBLIC", "FRIENDS", "PRIVATE"]).default("PUBLIC"),
});
exports.updatePostSchema = zod_1.z.object({
    content: zod_1.z.string().min(1).max(5000).optional(),
    imageUrl: zod_1.z.string().url().optional(),
    visibility: zod_1.z.enum(["PUBLIC", "FRIENDS", "PRIVATE"]).optional(),
});
//# sourceMappingURL=posts.validation.js.map