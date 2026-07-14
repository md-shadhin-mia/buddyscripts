"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePresignedUrl = generatePresignedUrl;
const crypto_1 = require("crypto");
const s3_1 = require("../../config/s3");
async function generatePresignedUrl(userId, fileName, contentType) {
    const key = `uploads/${userId}/${(0, crypto_1.randomUUID)()}-${fileName}`;
    const url = await (0, s3_1.getPresignedUploadUrl)(key, contentType);
    return { url, key, publicUrl: (0, s3_1.getPublicUrl)(key) };
}
//# sourceMappingURL=upload.service.js.map