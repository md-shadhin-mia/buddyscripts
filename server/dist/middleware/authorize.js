"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeOwnership = authorizeOwnership;
const errors_1 = require("../lib/errors");
function authorizeOwnership(getResource) {
    return async (req, _res, next) => {
        if (!req.user) {
            throw errors_1.ApiError.unauthorized();
        }
        const resource = await getResource(req);
        if (!resource) {
            throw errors_1.ApiError.notFound("Resource not found");
        }
        const ownerId = resource.userId ?? resource.authorId;
        if (ownerId !== req.user.id) {
            throw errors_1.ApiError.forbidden("You do not own this resource");
        }
        next();
    };
}
//# sourceMappingURL=authorize.js.map