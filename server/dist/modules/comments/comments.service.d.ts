interface CreateCommentInput {
    content: string;
    media?: {
        url: string;
        type: string;
    }[];
}
interface UpdateCommentInput {
    content: string;
}
export declare function createComment(userId: string, postId: string, input: CreateCommentInput): Promise<{
    id: string;
    content: string;
    postId: string;
    authorId: string;
    parentId: string | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    myReaction: null;
    _count: {
        reactions: number;
    };
    author: {
        avatar: string | null;
        id: string;
        name: string;
    };
    media: {
        id: string;
        commentId: string;
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
}>;
export declare function getComments(postId: string, params: {
    cursor?: string;
    take?: number;
}, userId?: string): Promise<{
    nextCursor: string | null;
    hasMore: boolean;
    data: any[];
}>;
export declare function updateComment(userId: string, id: string, input: UpdateCommentInput): Promise<{
    id: string;
    content: string;
    postId: string;
    authorId: string;
    parentId: string | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    myReaction: null;
    _count: {
        reactions: number;
    };
    author: {
        avatar: string | null;
        id: string;
        name: string;
    };
    media: {
        id: string;
        commentId: string;
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
}>;
export declare function deleteComment(userId: string, id: string): Promise<void>;
export declare function replyToComment(userId: string, parentId: string, input: CreateCommentInput): Promise<{
    id: string;
    content: string;
    postId: string;
    authorId: string;
    parentId: string | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    myReaction: null;
    _count: {
        reactions: number;
    };
    author: {
        avatar: string | null;
        id: string;
        name: string;
    };
    media: {
        id: string;
        commentId: string;
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
}>;
export {};
//# sourceMappingURL=comments.service.d.ts.map