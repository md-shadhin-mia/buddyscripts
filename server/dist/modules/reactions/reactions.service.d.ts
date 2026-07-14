interface CreateReactionInput {
    type: "LIKE" | "LOVE" | "HAHA" | "WOW" | "SAD" | "ANGRY";
}
export declare function reactToPost(userId: string, postId: string, input: CreateReactionInput): Promise<{
    user: {
        avatar: string | null;
        id: string;
        name: string;
    };
} & {
    id: string;
    type: import("../../generated/prisma").$Enums.ReactionType;
    postId: string | null;
    commentId: string | null;
    userId: string;
    createdAt: Date;
}>;
export declare function removePostReaction(userId: string, postId: string): Promise<void>;
export declare function getPostReactions(postId: string): Promise<({
    user: {
        avatar: string | null;
        id: string;
        name: string;
    };
} & {
    id: string;
    type: import("../../generated/prisma").$Enums.ReactionType;
    postId: string | null;
    commentId: string | null;
    userId: string;
    createdAt: Date;
})[]>;
export declare function reactToComment(userId: string, commentId: string, input: CreateReactionInput): Promise<{
    id: string;
    type: import("../../generated/prisma").$Enums.ReactionType;
    postId: string | null;
    commentId: string | null;
    userId: string;
    createdAt: Date;
}>;
export declare function removeCommentReaction(userId: string, commentId: string): Promise<void>;
export {};
//# sourceMappingURL=reactions.service.d.ts.map