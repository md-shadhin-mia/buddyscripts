"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanOldNotifications = cleanOldNotifications;
const database_1 = __importDefault(require("../config/database"));
async function cleanOldNotifications() {
    const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const { count } = await database_1.default.notification.deleteMany({
        where: {
            isRead: true,
            createdAt: { lt: cutoff },
        },
    });
    if (count > 0) {
        console.log(`[notificationCleanup] Deleted ${count} old read notifications`);
    }
}
//# sourceMappingURL=notificationCleanup.js.map