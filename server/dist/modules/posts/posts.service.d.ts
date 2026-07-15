interface MediaInput {
    url: string;
    type: "image" | "video";
}
interface CreatePostInput {
    content: string;
    imageUrl?: string;
    media?: MediaInput[];
    visibility?: "PUBLIC" | "FRIENDS" | "PRIVATE";
}
interface UpdatePostInput {
    content?: string;
    imageUrl?: string;
    visibility?: "PUBLIC" | "FRIENDS" | "PRIVATE";
}
export declare function createPost(userId: string, input: CreatePostInput): Promise<{
    author: {
        avatar: string | null;
        id: string;
        name: string;
    };
    media: {
        id: string;
        postId: string;
        url: string;
        type: string;
        order: number;
    }[];
} & {
    id: string;
    content: string;
    imageUrl: string | null;
    visibility: import("../../generated/prisma").$Enums.PostVisibility;
    authorId: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}>;
export declare function getFeed(userId: string, params: {
    cursor?: string;
    take?: number;
}): Promise<import("../../lib/pagination").PaginateResult<{
    id: string;
}>>;
export declare function getPost(id: string): Promise<{
    _count: {
        comments: number;
        reactions: number;
    };
    author: {
        avatar: string | null;
        id: string;
        name: string;
    };
    media: {
        id: string;
        postId: string;
        url: string;
        type: string;
        order: number;
    }[];
    reactions: {
        type: import("../../generated/prisma").$Enums.ReactionType;
        user: {
            avatar: string | null;
            id: string;
            name: string;
        };
        userId: string;
    }[];
} & {
    id: string;
    content: string;
    imageUrl: string | null;
    visibility: import("../../generated/prisma").$Enums.PostVisibility;
    authorId: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}>;
export declare function updatePost(userId: string, id: string, input: UpdatePostInput): Promise<{
    author: {
        avatar: string | null;
        id: string;
        name: string;
    };
    media: {
        id: string;
        postId: string;
        url: string;
        type: string;
        order: number;
    }[];
} & {
    id: string;
    content: string;
    imageUrl: string | null;
    visibility: import("../../generated/prisma").$Enums.PostVisibility;
    authorId: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}>;
export declare function deletePost(userId: string, id: string): Promise<void>;
export declare function savePost(userId: string, postId: string): Promise<void>;
export declare function unsavePost(userId: string, postId: string): Promise<void>;
export declare function getSavedPosts(userId: string, params: {
    cursor?: string;
    take?: number;
}): Promise<import("../../lib/pagination").PaginateResult<{
    id: string;
}>>;
export {};
//# sourceMappingURL=posts.service.d.ts.map