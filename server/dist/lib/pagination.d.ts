export interface PaginateParams {
    cursor?: string;
    take?: number;
}
export interface PaginateResult<T> {
    data: T[];
    nextCursor: string | null;
    hasMore: boolean;
}
export declare function paginate<T extends {
    id: string;
}>(model: any, params: PaginateParams & {
    where?: Record<string, unknown>;
}, defaultTake?: number, extraArgs?: Record<string, unknown>): Promise<PaginateResult<T>>;
//# sourceMappingURL=pagination.d.ts.map