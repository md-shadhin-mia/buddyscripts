import { Request, Response, NextFunction } from "express";
export declare function authorizeOwnership<T extends {
    userId?: string;
    authorId?: string;
}>(getResource: (req: Request) => Promise<T | null>): (req: Request, _res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=authorize.d.ts.map