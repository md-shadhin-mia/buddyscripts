export declare function uploadFile(userId: string, file: {
    buffer: Buffer;
    originalname: string;
    mimetype: string;
}): Promise<{
    key: string;
    url: string;
}>;
//# sourceMappingURL=upload.service.d.ts.map