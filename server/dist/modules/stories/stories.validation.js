"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStorySchema = void 0;
const zod_1 = require("zod");
const imageUrlSchema = zod_1.z.union([zod_1.z.string().url(), zod_1.z.string().startsWith("/")]);
exports.createStorySchema = zod_1.z.object({
    imageUrl: imageUrlSchema,
    content: zod_1.z.string().max(500).optional(),
});
//# sourceMappingURL=stories.validation.js.map