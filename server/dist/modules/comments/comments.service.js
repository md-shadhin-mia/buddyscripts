"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createComment = createComment;
exports.getComments = getComments;
exports.updateComment = updateComment;
exports.deleteComment = deleteComment;
exports.replyToComment = replyToComment;
const database_1 = __importDefault(require("../../config/database"));
const errors_1 = require("../../lib/errors");
const pagination_1 = require("../../lib/pagination");
const notifications_service_1 = require("../notifications/notifications.service");
const commentInclude = {
    author: { select: { id: true, name: true, avatar: true } },
};
async function createComment(userId, postId, input) {
    const comment = await database_1.default.comment.create({
        data: {
            content: input.content,
            postId,
            authorId: userId,
        },
        include: commentInclude,
    });
    const post = await database_1.default.post.findUnique({
        where: { id: postId },
        select: { authorId: true },
    });
    if (post && post.authorId !== userId) {
        await (0, notifications_service_1.createNotification)({
            userId: post.authorId,
            actorId: userId,
            type: "POST_COMMENT",
            entityType: "COMMENT",
            entityId: comment.id,
        });
    }
    return comment;
}
async function getComments(postId, params) {
    const where = { postId, parentId: null, deletedAt: null };
    const result = await (0, pagination_1.paginate)(database_1.default.comment, { ...params, where }, 20, {
        include: commentInclude,
    });
    return result;
}
async function updateComment(userId, id, input) {
    const comment = await database_1.default.comment.findUnique({ where: { id }, select: { authorId: true, deletedAt: true } });
    if (!comment || comment.deletedAt)
        throw errors_1.ApiError.notFound("Comment not found");
    if (comment.authorId !== userId)
        throw errors_1.ApiError.forbidden();
    const updated = await database_1.default.comment.update({
        where: { id },
        data: input,
        include: commentInclude,
    });
    return updated;
}
async function deleteComment(userId, id) {
    const comment = await database_1.default.comment.findUnique({ where: { id }, select: { authorId: true, deletedAt: true } });
    if (!comment || comment.deletedAt)
        throw errors_1.ApiError.notFound("Comment not found");
    if (comment.authorId !== userId)
        throw errors_1.ApiError.forbidden();
    await database_1.default.comment.update({
        where: { id },
        data: { deletedAt: new Date() },
    });
}
async function replyToComment(userId, parentId, input) {
    const parent = await database_1.default.comment.findUnique({ where: { id: parentId }, select: { postId: true, authorId: true, deletedAt: true } });
    if (!parent || parent.deletedAt)
        throw errors_1.ApiError.notFound("Parent comment not found");
    const reply = await database_1.default.comment.create({
        data: {
            content: input.content,
            postId: parent.postId,
            authorId: userId,
            parentId,
        },
        include: commentInclude,
    });
    if (parent.authorId !== userId) {
        await (0, notifications_service_1.createNotification)({
            userId: parent.authorId,
            actorId: userId,
            type: "COMMENT_REPLY",
            entityType: "COMMENT",
            entityId: reply.id,
        });
    }
    return reply;
}
//# sourceMappingURL=comments.service.js.map