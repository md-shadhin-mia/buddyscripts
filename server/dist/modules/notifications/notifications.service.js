"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNotification = createNotification;
exports.getNotifications = getNotifications;
exports.getUnreadCount = getUnreadCount;
exports.markAsRead = markAsRead;
exports.markAllAsRead = markAllAsRead;
const database_1 = __importDefault(require("../../config/database"));
const errors_1 = require("../../lib/errors");
const socket_1 = require("../../socket");
async function createNotification(input) {
    const notification = await database_1.default.notification.create({
        data: input,
        include: { actor: { select: { id: true, name: true, avatar: true } } },
    });
    const io = (0, socket_1.getIO)();
    io?.to(`user:${input.userId}`).emit("notification:new", { notification });
    return notification;
}
async function getNotifications(userId, params) {
    const take = params.take ?? 20;
    const where = { userId };
    if (params.cursor) {
        where.createdAt = { lt: new Date(params.cursor) };
    }
    const [data, total] = await Promise.all([
        database_1.default.notification.findMany({
            where,
            include: { actor: { select: { id: true, name: true, avatar: true } } },
            orderBy: { createdAt: "desc" },
            take: take + 1,
        }),
        database_1.default.notification.count({ where: { userId } }),
    ]);
    const hasMore = data.length > take;
    const items = hasMore ? data.slice(0, take) : data;
    const nextCursor = hasMore ? items[items.length - 1].createdAt.toISOString() : null;
    return { data: items, nextCursor, hasMore, total };
}
async function getUnreadCount(userId) {
    const count = await database_1.default.notification.count({
        where: { userId, isRead: false },
    });
    return count;
}
async function markAsRead(userId, notificationId) {
    const notif = await database_1.default.notification.findUnique({ where: { id: notificationId }, select: { userId: true } });
    if (!notif)
        throw errors_1.ApiError.notFound("Notification not found");
    if (notif.userId !== userId)
        throw errors_1.ApiError.forbidden();
    await database_1.default.notification.update({
        where: { id: notificationId },
        data: { isRead: true },
    });
}
async function markAllAsRead(userId) {
    await database_1.default.notification.updateMany({
        where: { userId, isRead: false },
        data: { isRead: true },
    });
}
//# sourceMappingURL=notifications.service.js.map