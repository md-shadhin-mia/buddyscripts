interface CreateCommentInput {
    content: string;
}
interface UpdateCommentInput {
    content: string;
}
export declare function createComment(userId: string, postId: string, input: CreateCommentInput): Promise<{
    author: {
        avatar: string | null;
        id: string;
        name: string;
    };
} & {
    id: string;
    content: string;
    postId: string;
    authorId: string;
    parentId: string | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}>;
export declare function getComments(postId: string, params: {
    cursor?: string;
    take?: number;
}): Promise<import("../../lib/pagination").PaginateResult<{
    id: string;
}>>;
export declare function updateComment(userId: string, id: string, input: UpdateCommentInput): Promise<{
    author: {
        avatar: string | null;
        id: string;
        name: string;
    };
} & {
    id: string;
    content: string;
    postId: string;
    authorId: string;
    parentId: string | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}>;
export declare function deleteComment(userId: string, id: string): Promise<void>;
export declare function replyToComment(userId: string, parentId: string, input: CreateCommentInput): Promise<{
    author: {
        avatar: string | null;
        id: string;
        name: string;
    };
} & {
    id: string;
    content: string;
    postId: string;
    authorId: string;
    parentId: string | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}>;
export {};
//# sourceMappingURL=comments.service.d.ts.map