"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.search = search;
const database_1 = __importDefault(require("../../config/database"));
async function search(query, type) {
    const types = type?.split(",").map((t) => t.trim()) ?? ["users", "posts", "events"];
    const results = {};
    if (types.includes("users")) {
        results.users = await database_1.default.user.findMany({
            where: {
                OR: [
                    { name: { contains: query, mode: "insensitive" } },
                    { email: { contains: query, mode: "insensitive" } },
                ],
            },
            select: { id: true, name: true, avatar: true, bio: true },
            take: 20,
        });
    }
    if (types.includes("posts")) {
        results.posts = await database_1.default.post.findMany({
            where: {
                deletedAt: null,
                content: { contains: query, mode: "insensitive" },
            },
            select: {
                id: true,
                content: true,
                createdAt: true,
                author: { select: { id: true, name: true, avatar: true } },
            },
            take: 20,
            orderBy: { createdAt: "desc" },
        });
    }
    if (types.includes("events")) {
        results.events = await database_1.default.event.findMany({
            where: {
                OR: [
                    { title: { contains: query, mode: "insensitive" } },
                    { description: { contains: query, mode: "insensitive" } },
                ],
            },
            select: {
                id: true,
                title: true,
                description: true,
                startDate: true,
                location: true,
                creator: { select: { id: true, name: true, avatar: true } },
            },
            take: 20,
            orderBy: { startDate: "asc" },
        });
    }
    return results;
}
//# sourceMappingURL=search.service.js.map