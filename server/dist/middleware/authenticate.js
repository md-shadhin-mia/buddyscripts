"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
const database_1 = __importDefault(require("../config/database"));
const jwt_1 = require("../lib/jwt");
const errors_1 = require("../lib/errors");
async function authenticate(req, _res, next) {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
        throw errors_1.ApiError.unauthorized("Missing or invalid authorization header");
    }
    const token = header.split(" ")[1];
    let payload;
    try {
        payload = (0, jwt_1.verifyAccessToken)(token);
    }
    catch {
        throw errors_1.ApiError.unauthorized("Invalid or expired access token");
    }
    const user = await database_1.default.user.findUnique({
        where: { id: payload.sub },
        select: { id: true, email: true, name: true, avatar: true },
    });
    if (!user) {
        throw errors_1.ApiError.unauthorized("User no longer exists");
    }
    req.user = user;
    next();
}
//# sourceMappingURL=authenticate.js.map