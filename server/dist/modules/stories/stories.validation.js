"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStorySchema = void 0;
const zod_1 = require("zod");
exports.createStorySchema = zod_1.z.object({
    imageUrl: zod_1.z.string().url(),
    content: zod_1.z.string().max(500).optional(),
});
//# sourceMappingURL=stories.validation.js.map