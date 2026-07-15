"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFile = uploadFile;
const crypto_1 = require("crypto");
const s3_1 = require("../../config/s3");
async function uploadFile(userId, file) {
    const key = `uploads/${userId}/${(0, crypto_1.randomUUID)()}-${file.originalname}`;
    await (0, s3_1.uploadToS3)(key, file.buffer, file.mimetype);
    return { key, url: `/api/files/${key}` };
}
//# sourceMappingURL=upload.service.js.map