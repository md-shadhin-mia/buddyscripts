"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerPresence = registerPresence;
const database_1 = __importDefault(require("../../config/database"));
function registerPresence(io, socket) {
    const userId = socket.data.userId;
    socket.join(`user:${userId}`);
    database_1.default.friendship
        .findMany({
        where: {
            OR: [{ user1Id: userId }, { user2Id: userId }],
        },
        select: { user1Id: true, user2Id: true },
    })
        .then((friendships) => {
        const friendIds = friendships.map((f) => f.user1Id === userId ? f.user2Id : f.user1Id);
        friendIds.forEach((friendId) => {
            socket.join(`presence:${friendId}`);
        });
        friendIds.forEach((friendId) => {
            io.to(`user:${friendId}`).emit("presence:online", { userId });
        });
    });
    socket.on("disconnect", () => {
        io.to(`user:${userId}`).emit("presence:offline", { userId });
    });
}
//# sourceMappingURL=presence.js.map