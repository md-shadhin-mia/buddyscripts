"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNotifications = getNotifications;
exports.getUnreadCount = getUnreadCount;
exports.markAsRead = markAsRead;
exports.markAllAsRead = markAllAsRead;
const notificationsService = __importStar(require("./notifications.service"));
const socket_1 = require("../../socket");
async function getNotifications(req, res) {
    const { cursor, take } = req.query;
    const result = await notificationsService.getNotifications(req.user.id, { cursor, take: take ? Number(take) : undefined });
    res.json({ status: "success", data: result });
}
async function getUnreadCount(req, res) {
    const count = await notificationsService.getUnreadCount(req.user.id);
    res.json({ status: "success", data: { count } });
}
async function markAsRead(req, res) {
    await notificationsService.markAsRead(req.user.id, req.params.id);
    (0, socket_1.getIO)()?.to(`user:${req.user.id}`).emit("notification:read", { notificationId: req.params.id });
    res.json({ status: "success", message: "Notification marked as read" });
}
async function markAllAsRead(req, res) {
    await notificationsService.markAllAsRead(req.user.id);
    res.json({ status: "success", message: "All notifications marked as read" });
}
//# sourceMappingURL=notifications.controller.js.map