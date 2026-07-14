"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replySchema = exports.updateCommentSchema = exports.createCommentSchema = void 0;
const zod_1 = require("zod");
exports.createCommentSchema = zod_1.z.object({
    content: zod_1.z.string().min(1).max(2000),
});
exports.updateCommentSchema = zod_1.z.object({
    content: zod_1.z.string().min(1).max(2000),
});
exports.replySchema = zod_1.z.object({
    content: zod_1.z.string().min(1).max(2000),
});
//# sourceMappingURL=comments.validation.js.map