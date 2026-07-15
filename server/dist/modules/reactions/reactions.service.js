"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reactToPost = reactToPost;
exports.removePostReaction = removePostReaction;
exports.getPostReactions = getPostReactions;
exports.reactToComment = reactToComment;
exports.removeCommentReaction = removeCommentReaction;
exports.getCommentReactions = getCommentReactions;
const database_1 = __importDefault(require("../../config/database"));
const notifications_service_1 = require("../notifications/notifications.service");
async function reactToPost(userId, postId, input) {
    const existing = await database_1.default.reaction.findFirst({
        where: { postId, userId },
    });
    if (existing) {
        if (existing.type === input.type) {
            await database_1.default.reaction.delete({ where: { id: existing.id } });
            return { removed: true, type: input.type };
        }
        await database_1.default.reaction.update({
            where: { id: existing.id },
            data: { type: input.type },
        });
        return { removed: false, type: input.type };
    }
    const reaction = await database_1.default.reaction.create({
        data: {
            type: input.type,
            postId,
            userId,
        },
        include: { user: { select: { id: true, name: true, avatar: true } } },
    });
    const post = await database_1.default.post.findUnique({
        where: { id: postId },
        select: { authorId: true },
    });
    if (post && post.authorId !== userId) {
        await (0, notifications_service_1.createNotification)({
            userId: post.authorId,
            actorId: userId,
            type: "POST_REACTION",
            entityType: "POST",
            entityId: postId,
        });
    }
    return reaction;
}
async function removePostReaction(userId, postId) {
    await database_1.default.reaction.deleteMany({
        where: { postId, userId },
    });
}
async function getPostReactions(postId) {
    const reactions = await database_1.default.reaction.findMany({
        where: { postId },
        include: { user: { select: { id: true, name: true, avatar: true } } },
        orderBy: { createdAt: "desc" },
    });
    return reactions;
}
async function reactToComment(userId, commentId, input) {
    const existing = await database_1.default.reaction.findFirst({
        where: { commentId, userId },
    });
    if (existing) {
        if (existing.type === input.type) {
            await database_1.default.reaction.delete({ where: { id: existing.id } });
            return { removed: true, type: input.type };
        }
        await database_1.default.reaction.update({
            where: { id: existing.id },
            data: { type: input.type },
        });
        return { removed: false, type: input.type };
    }
    const reaction = await database_1.default.reaction.create({
        data: {
            type: input.type,
            commentId,
            userId,
        },
    });
    const comment = await database_1.default.comment.findUnique({
        where: { id: commentId },
        select: { authorId: true },
    });
    if (comment && comment.authorId !== userId) {
        await (0, notifications_service_1.createNotification)({
            userId: comment.authorId,
            actorId: userId,
            type: "POST_REACTION",
            entityType: "COMMENT",
            entityId: commentId,
        });
    }
    return reaction;
}
async function removeCommentReaction(userId, commentId) {
    await database_1.default.reaction.deleteMany({
        where: { commentId, userId },
    });
}
async function getCommentReactions(commentId) {
    const reactions = await database_1.default.reaction.findMany({
        where: { commentId },
        include: { user: { select: { id: true, name: true, avatar: true } } },
        orderBy: { createdAt: "desc" },
    });
    return reactions;
}
//# sourceMappingURL=reactions.service.js.map