export declare function signAccessToken(userId: string): string;
export declare function signRefreshToken(userId: string, jti: string): string;
export declare function verifyAccessToken(token: string): {
    sub: string;
};
export declare function verifyRefreshToken(token: string): {
    sub: string;
    jti: string;
};
//# sourceMappingURL=jwt.d.ts.map