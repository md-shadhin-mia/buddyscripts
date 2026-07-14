"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPresignedUploadUrl = getPresignedUploadUrl;
exports.getPublicUrl = getPublicUrl;
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
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
async function getPresignedUploadUrl(key, contentType) {
    if (!s3)
        throw new Error("S3 not configured");
    const command = new client_s3_1.PutObjectCommand({
        Bucket: env_1.env.S3_BUCKET,
        Key: key,
        ContentType: contentType,
    });
    return (0, s3_request_presigner_1.getSignedUrl)(s3, command, { expiresIn: 3600 });
}
function getPublicUrl(key) {
    return `${env_1.env.S3_PUBLIC_URL}/${key}`;
}
//# sourceMappingURL=s3.js.map