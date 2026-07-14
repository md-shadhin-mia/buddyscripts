import { Request, Response } from "express";
export declare function getFeed(req: Request, res: Response): Promise<void>;
export declare function createPost(req: Request, res: Response): Promise<void>;
export declare function getPost(req: Request<{
    id: string;
}>, res: Response): Promise<void>;
export declare function updatePost(req: Request<{
    id: string;
}>, res: Response): Promise<void>;
export declare function deletePost(req: Request<{
    id: string;
}>, res: Response): Promise<void>;
export declare function savePost(req: Request<{
    id: string;
}>, res: Response): Promise<void>;
export declare function unsavePost(req: Request<{
    id: string;
}>, res: Response): Promise<void>;
export declare function getSavedPosts(req: Request, res: Response): Promise<void>;
//# sourceMappingURL=posts.controller.d.ts.map