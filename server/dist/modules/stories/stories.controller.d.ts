import { Request, Response } from "express";
export declare function createStory(req: Request, res: Response): Promise<void>;
export declare function getActiveStories(req: Request, res: Response): Promise<void>;
export declare function deleteStory(req: Request<{
    id: string;
}>, res: Response): Promise<void>;
export declare function viewStory(req: Request<{
    id: string;
}>, res: Response): Promise<void>;
//# sourceMappingURL=stories.controller.d.ts.map