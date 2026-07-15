"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
exports.refresh = refresh;
exports.logout = logout;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto"));
const database_1 = __importDefault(require("../../config/database"));
const jwt_1 = require("../../lib/jwt");
const errors_1 = require("../../lib/errors");
const SALT_ROUNDS = 12;
function generateJti() {
    return crypto_1.default.randomUUID();
}
async function register(input) {
    const existing = await database_1.default.user.findUnique({ where: { email: input.email } });
    if (existing) {
        throw errors_1.ApiError.conflict("Email already in use");
    }
    const hashedPassword = await bcryptjs_1.default.hash(input.password, SALT_ROUNDS);
    const user = await database_1.default.user.create({
        data: {
            email: input.email,
            password: hashedPassword,
            name: input.name,
        },
        select: { id: true, email: true, name: true, avatar: true, createdAt: true },
    });
    return { user };
}
async function login(input) {
    const user = await database_1.default.user.findUnique({ where: { email: input.email } });
    if (!user) {
        throw errors_1.ApiError.unauthorized("Invalid email or password");
    }
    const valid = await bcryptjs_1.default.compare(input.password, user.password);
    if (!valid) {
        throw errors_1.ApiError.unauthorized("Invalid email or password");
    }
    const accessToken = (0, jwt_1.signAccessToken)(user.id);
    const jti = generateJti();
    const refreshToken = (0, jwt_1.signRefreshToken)(user.id, jti);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await database_1.default.refreshToken.create({
        data: {
            token: await bcryptjs_1.default.hash(refreshToken, 10),
            userId: user.id,
            expiresAt,
        },
    });
    return {
        user: { id: user.id, email: user.email, name: user.name, avatar: user.avatar },
        accessToken,
        refreshToken,
    };
}
async function refresh(token) {
    let payload;
    try {
        payload = (0, jwt_1.verifyRefreshToken)(token);
    }
    catch {
        throw errors_1.ApiError.unauthorized("Invalid or expired refresh token");
    }
    const storedTokens = await database_1.default.refreshToken.findMany({
        where: { userId: payload.sub },
    });
    let matchedToken;
    for (const st of storedTokens) {
        const ok = await bcryptjs_1.default.compare(token, st.token);
        if (ok) {
            matchedToken = st;
            break;
        }
    }
    if (!matchedToken) {
        throw errors_1.ApiError.unauthorized("Refresh token not found");
    }
    await database_1.default.refreshToken.delete({ where: { id: matchedToken.id } });
    const accessToken = (0, jwt_1.signAccessToken)(payload.sub);
    const newJti = generateJti();
    const refreshToken = (0, jwt_1.signRefreshToken)(payload.sub, newJti);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await database_1.default.refreshToken.create({
        data: {
            token: await bcryptjs_1.default.hash(refreshToken, 10),
            userId: payload.sub,
            expiresAt,
        },
    });
    return { accessToken, refreshToken };
}
async function logout(token) {
    const storedTokens = await database_1.default.refreshToken.findMany();
    for (const st of storedTokens) {
        const ok = await bcryptjs_1.default.compare(token, st.token);
        if (ok) {
            await database_1.default.refreshToken.delete({ where: { id: st.id } });
            return;
        }
    }
}
//# sourceMappingURL=auth.service.js.map