import { Request, Response } from "express";
export declare function createComment(req: Request<{
    postId: string;
}>, res: Response): Promise<void>;
export declare function getComments(req: Request<{
    postId: string;
}>, res: Response): Promise<void>;
export declare function updateComment(req: Request<{
    id: string;
}>, res: Response): Promise<void>;
export declare function deleteComment(req: Request<{
    id: string;
}>, res: Response): Promise<void>;
export declare function replyToComment(req: Request<{
    id: string;
}>, res: Response): Promise<void>;
//# sourceMappingURL=comments.controller.d.ts.map