interface RegisterInput {
    email: string;
    password: string;
    name: string;
}
interface LoginInput {
    email: string;
    password: string;
}
export declare function register(input: RegisterInput): Promise<{
    user: {
        avatar: string | null;
        createdAt: Date;
        email: string;
        id: string;
        name: string;
    };
}>;
export declare function login(input: LoginInput): Promise<{
    user: {
        id: string;
        email: string;
        name: string;
        avatar: string | null;
    };
    accessToken: string;
    refreshToken: string;
}>;
export declare function refresh(token: string): Promise<{
    accessToken: string;
    refreshToken: string;
}>;
export declare function logout(token: string): Promise<void>;
export {};
//# sourceMappingURL=auth.service.d.ts.map