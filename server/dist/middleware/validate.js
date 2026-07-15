"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = validate;
const errors_1 = require("../lib/errors");
function validate(schema) {
    return (req, _res, next) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            const messages = result.error.issues.map((e) => `${e.path.join(".")}: ${e.message}`);
            throw errors_1.ApiError.badRequest(messages.join("; "));
        }
        req.body = result.data;
        next();
    };
}
//# sourceMappingURL=validate.js.map