import { Request, Response } from "express";
export declare function reactToPost(req: Request<{
    postId: string;
}>, res: Response): Promise<void>;
export declare function removePostReaction(req: Request<{
    postId: string;
}>, res: Response): Promise<void>;
export declare function getPostReactions(req: Request<{
    postId: string;
}>, res: Response): Promise<void>;
export declare function reactToComment(req: Request<{
    commentId: string;
}>, res: Response): Promise<void>;
export declare function removeCommentReaction(req: Request<{
    commentId: string;
}>, res: Response): Promise<void>;
export declare function getCommentReactions(req: Request<{
    commentId: string;
}>, res: Response): Promise<void>;
//# sourceMappingURL=reactions.controller.d.ts.map