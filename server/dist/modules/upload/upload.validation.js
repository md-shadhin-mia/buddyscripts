"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.presignedUrlSchema = void 0;
const zod_1 = require("zod");
exports.presignedUrlSchema = zod_1.z.object({
    fileName: zod_1.z.string().min(1).max(255),
    contentType: zod_1.z.string().min(1),
});
//# sourceMappingURL=upload.validation.js.map