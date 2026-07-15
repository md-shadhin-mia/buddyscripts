export declare function uploadToS3(key: string, buffer: Buffer, contentType: string): Promise<void>;
export declare function getFileStream(key: string): Promise<import("@aws-sdk/client-s3").GetObjectCommandOutput>;
//# sourceMappingURL=s3.d.ts.map