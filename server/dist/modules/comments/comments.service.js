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
const commentInclude = (userId) => ({
    author: { select: { id: true, name: true, avatar: true } },
    media: { orderBy: { order: "asc" } },
    _count: { select: { reactions: true } },
    reactions: {
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
            type: true,
            userId: true,
            user: { select: { id: true, name: true, avatar: true } },
        },
    },
});
async function getMyReaction(userId, entityId, entityField) {
    if (!userId)
        return null;
    const reaction = await database_1.default.reaction.findFirst({
        where: { [entityField]: entityId, userId },
        select: { type: true },
    });
    return reaction?.type ?? null;
}
async function createComment(userId, postId, input) {
    const comment = await database_1.default.comment.create({
        data: {
            content: input.content,
            postId,
            authorId: userId,
            media: input.media
                ? {
                    create: input.media.map((m, i) => ({
                        url: m.url,
                        type: m.type,
                        order: i,
                    })),
                }
                : undefined,
        },
        include: commentInclude(),
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
    return { ...comment, myReaction: null };
}
async function getComments(postId, params, userId) {
    const where = { postId, parentId: null, deletedAt: null };
    const result = await (0, pagination_1.paginate)(database_1.default.comment, { ...params, where }, 20, {
        include: {
            ...commentInclude(),
            replies: {
                where: { deletedAt: null },
                orderBy: { createdAt: "asc" },
                include: {
                    ...commentInclude(),
                    replies: false,
                },
            },
        },
    });
    const enriched = await Promise.all(result.data.map(async (comment) => {
        const myReaction = await getMyReaction(userId, comment.id, "commentId");
        const repliesWithReaction = comment.replies
            ? await Promise.all(comment.replies.map(async (reply) => {
                const replyReaction = await getMyReaction(userId, reply.id, "commentId");
                return { ...reply, myReaction: replyReaction };
            }))
            : [];
        return { ...comment, myReaction, replies: repliesWithReaction };
    }));
    return { ...result, data: enriched };
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
        include: commentInclude(),
    });
    return { ...updated, myReaction: null };
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
            media: input.media
                ? {
                    create: input.media.map((m, i) => ({
                        url: m.url,
                        type: m.type,
                        order: i,
                    })),
                }
                : undefined,
        },
        include: commentInclude(),
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
    return { ...reply, myReaction: null };
}
//# sourceMappingURL=comments.service.js.map