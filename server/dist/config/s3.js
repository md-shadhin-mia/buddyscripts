"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadToS3 = uploadToS3;
exports.getFileStream = getFileStream;
const client_s3_1 = require("@aws-sdk/client-s3");
const env_1 = require("./env");
const s3 = env_1.env.S3_ENDPOINT
    ? new client_s3_1.S3Client({
        endpoint: env_1.env.S3_ENDPOINT,
        region: env_1.env.S3_REGION ?? "us-east-1",
        credentials: {
            accessKeyId: env_1.env.S3_ACCESS_KEY ?? "",
            secretAccessKey: env_1.env.S3_SECRET_KEY ?? "",
        },
        forcePathStyle: true,
    })
    : null;
async function uploadToS3(key, buffer, contentType) {
    if (!s3)
        throw new Error("S3 not configured");
    const command = new client_s3_1.PutObjectCommand({
        Bucket: env_1.env.S3_BUCKET,
        Key: key,
        Body: buffer,
        ContentType: contentType,
    });
    await s3.send(command);
}
async function getFileStream(key) {
    if (!s3)
        throw new Error("S3 not configured");
    const command = new client_s3_1.GetObjectCommand({
        Bucket: env_1.env.S3_BUCKET,
        Key: key,
    });
    return s3.send(command);
}
//# sourceMappingURL=s3.js.map