"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPost = createPost;
exports.getFeed = getFeed;
exports.getPost = getPost;
exports.updatePost = updatePost;
exports.deletePost = deletePost;
exports.savePost = savePost;
exports.unsavePost = unsavePost;
exports.getSavedPosts = getSavedPosts;
const database_1 = __importDefault(require("../../config/database"));
const errors_1 = require("../../lib/errors");
const pagination_1 = require("../../lib/pagination");
const postInclude = {
    author: { select: { id: true, name: true, avatar: true } },
};
async function createPost(userId, input) {
    const post = await database_1.default.post.create({
        data: {
            content: input.content,
            imageUrl: input.imageUrl,
            visibility: input.visibility ?? "PUBLIC",
            authorId: userId,
        },
        include: postInclude,
    });
    return post;
}
async function getFeed(userId, params) {
    const friendIds = (await database_1.default.friendship.findMany({
        where: {
            OR: [{ user1Id: userId }, { user2Id: userId }],
        },
        select: { user1Id: true, user2Id: true },
    })).map((f) => (f.user1Id === userId ? f.user2Id : f.user1Id));
    const hiddenIds = (await database_1.default.hiddenPost.findMany({
        where: { userId },
        select: { postId: true },
    })).map((h) => h.postId);
    const where = {
        deletedAt: null,
        id: { notIn: hiddenIds },
        OR: [
            { visibility: "PUBLIC" },
            { visibility: "FRIENDS", authorId: { in: friendIds } },
            { authorId: userId },
        ],
    };
    const result = await (0, pagination_1.paginate)(database_1.default.post, { ...params, where }, 20, {
        include: {
            ...postInclude,
            _count: { select: { comments: true, reactions: true } },
        },
    });
    return result;
}
async function getPost(id) {
    const post = await database_1.default.post.findUnique({
        where: { id },
        include: {
            ...postInclude,
            _count: { select: { comments: true, reactions: true } },
        },
    });
    if (!post || post.deletedAt)
        throw errors_1.ApiError.notFound("Post not found");
    return post;
}
async function updatePost(userId, id, input) {
    const post = await database_1.default.post.findUnique({ where: { id }, select: { authorId: true, deletedAt: true } });
    if (!post || post.deletedAt)
        throw errors_1.ApiError.notFound("Post not found");
    if (post.authorId !== userId)
        throw errors_1.ApiError.forbidden();
    const updated = await database_1.default.post.update({
        where: { id },
        data: input,
        include: postInclude,
    });
    return updated;
}
async function deletePost(userId, id) {
    const post = await database_1.default.post.findUnique({ where: { id }, select: { authorId: true, deletedAt: true } });
    if (!post || post.deletedAt)
        throw errors_1.ApiError.notFound("Post not found");
    if (post.authorId !== userId)
        throw errors_1.ApiError.forbidden();
    await database_1.default.post.update({
        where: { id },
        data: { deletedAt: new Date() },
    });
}
async function savePost(userId, postId) {
    await database_1.default.savedPost.create({
        data: { userId, postId },
    });
}
async function unsavePost(userId, postId) {
    await database_1.default.savedPost.delete({
        where: { userId_postId: { userId, postId } },
    });
}
async function getSavedPosts(userId, params) {
    const result = await (0, pagination_1.paginate)(database_1.default.savedPost, {
        ...params,
        where: { userId },
    });
    return result;
}
//# sourceMappingURL=posts.service.js.map