"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanExpiredStories = cleanExpiredStories;
const database_1 = __importDefault(require("../config/database"));
async function cleanExpiredStories() {
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const { count } = await database_1.default.story.deleteMany({
        where: { createdAt: { lt: cutoff } },
    });
    if (count > 0) {
        console.log(`[storyCleanup] Deleted ${count} expired stories`);
    }
}
//# sourceMappingURL=storyCleanup.js.map