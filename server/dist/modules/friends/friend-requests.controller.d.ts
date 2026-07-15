import { Request, Response } from "express";
export declare function sendFriendRequest(req: Request, res: Response): Promise<void>;
export declare function acceptFriendRequest(req: Request<{
    id: string;
}>, res: Response): Promise<void>;
export declare function declineFriendRequest(req: Request<{
    id: string;
}>, res: Response): Promise<void>;
export declare function getPendingRequests(req: Request, res: Response): Promise<void>;
export declare function getSentRequests(req: Request, res: Response): Promise<void>;
export declare function cancelFriendRequest(req: Request<{
    id: string;
}>, res: Response): Promise<void>;
//# sourceMappingURL=friend-requests.controller.d.ts.map