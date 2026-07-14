import { Request, Response } from "express";
export declare function createEvent(req: Request, res: Response): Promise<void>;
export declare function getEvents(_req: Request, res: Response): Promise<void>;
export declare function getEvent(req: Request<{
    id: string;
}>, res: Response): Promise<void>;
export declare function updateEvent(req: Request<{
    id: string;
}>, res: Response): Promise<void>;
export declare function deleteEvent(req: Request<{
    id: string;
}>, res: Response): Promise<void>;
export declare function rsvp(req: Request<{
    id: string;
}>, res: Response): Promise<void>;
//# sourceMappingURL=events.controller.d.ts.map