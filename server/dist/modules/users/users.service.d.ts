interface UpdateProfileInput {
    name?: string;
    bio?: string;
}
export declare function getProfile(id: string): Promise<{
    avatar: string | null;
    bio: string | null;
    createdAt: Date;
    email: string;
    id: string;
    name: string;
}>;
export declare function updateProfile(id: string, input: UpdateProfileInput): Promise<{
    avatar: string | null;
    bio: string | null;
    createdAt: Date;
    email: string;
    id: string;
    name: string;
}>;
export declare function getUserPosts(id: string, params: {
    cursor?: string;
    take?: number;
}): Promise<import("../../lib/pagination").PaginateResult<{
    id: string;
}>>;
export {};
//# sourceMappingURL=users.service.d.ts.map