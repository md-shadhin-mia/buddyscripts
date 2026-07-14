import { Request, Response } from "express";
export declare function getMe(req: Request, res: Response): Promise<void>;
export declare function updateMe(req: Request, res: Response): Promise<void>;
export declare function getUserById(req: Request<{
    id: string;
}>, res: Response): Promise<void>;
export declare function getUserPosts(req: Request<{
    id: string;
}>, res: Response): Promise<void>;
//# sourceMappingURL=users.controller.d.ts.map