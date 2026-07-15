"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStory = createStory;
exports.getActiveStories = getActiveStories;
exports.deleteStory = deleteStory;
exports.viewStory = viewStory;
const database_1 = __importDefault(require("../../config/database"));
const errors_1 = require("../../lib/errors");
const storyInclude = {
    author: { select: { id: true, name: true, avatar: true } },
};
async function createStory(userId, input) {
    const story = await database_1.default.story.create({
        data: {
            imageUrl: input.imageUrl,
            content: input.content,
            authorId: userId,
        },
        include: storyInclude,
    });
    return story;
}
async function getActiveStories(currentUserId) {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const stories = await database_1.default.story.findMany({
        where: { createdAt: { gte: twentyFourHoursAgo } },
        include: {
            author: { select: { id: true, name: true, avatar: true } },
            viewers: { where: { userId: currentUserId } },
        },
        orderBy: { createdAt: "desc" },
    });
    return stories;
}
async function deleteStory(userId, storyId) {
    const story = await database_1.default.story.findUnique({ where: { id: storyId }, select: { authorId: true } });
    if (!story)
        throw errors_1.ApiError.notFound("Story not found");
    if (story.authorId !== userId)
        throw errors_1.ApiError.forbidden();
    await database_1.default.story.delete({ where: { id: storyId } });
}
async function viewStory(userId, storyId) {
    await database_1.default.storyViewer.create({
        data: { storyId, userId },
    });
    await database_1.default.story.update({
        where: { id: storyId },
        data: { viewCount: { increment: 1 } },
    });
}
//# sourceMappingURL=stories.service.js.map