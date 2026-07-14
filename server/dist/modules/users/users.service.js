"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfile = getProfile;
exports.updateProfile = updateProfile;
exports.getUserPosts = getUserPosts;
const database_1 = __importDefault(require("../../config/database"));
const errors_1 = require("../../lib/errors");
const pagination_1 = require("../../lib/pagination");
const userSelect = {
    id: true,
    email: true,
    name: true,
    avatar: true,
    bio: true,
    createdAt: true,
};
async function getProfile(id) {
    const user = await database_1.default.user.findUnique({
        where: { id },
        select: userSelect,
    });
    if (!user)
        throw errors_1.ApiError.notFound("User not found");
    return user;
}
async function updateProfile(id, input) {
    const user = await database_1.default.user.update({
        where: { id },
        data: input,
        select: userSelect,
    });
    return user;
}
async function getUserPosts(id, params) {
    const where = { authorId: id, deletedAt: null };
    const result = await (0, pagination_1.paginate)(database_1.default.post, { ...params, where });
    return result;
}
//# sourceMappingURL=users.service.js.map