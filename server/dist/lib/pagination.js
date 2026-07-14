"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginate = paginate;
async function paginate(model, params, defaultTake = 20, extraArgs = {}) {
    const take = params.take ?? defaultTake;
    const takePlusOne = take + 1;
    const args = {
        take: takePlusOne,
        orderBy: { id: "desc" },
        ...(params.where && { where: params.where }),
        ...extraArgs,
    };
    if (params.cursor) {
        args.cursor = { id: params.cursor };
        args.skip = 1;
    }
    const items = await model.findMany(args);
    const hasMore = items.length > take;
    const data = hasMore ? items.slice(0, take) : items;
    const nextCursor = hasMore ? data[data.length - 1].id : null;
    return { data, nextCursor, hasMore };
}
//# sourceMappingURL=pagination.js.map