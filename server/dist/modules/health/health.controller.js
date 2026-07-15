"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.check = check;
const database_1 = __importDefault(require("../../config/database"));
const startTime = Date.now();
async function check(req, res) {
    const dbStart = Date.now();
    let dbOk = false;
    try {
        await database_1.default.$queryRaw `SELECT 1`;
        dbOk = true;
    }
    catch { }
    const dbLatency = Date.now() - dbStart;
    const mem = process.memoryUsage();
    res.json({
        status: "ok",
        uptime: Math.floor((Date.now() - startTime) / 1000),
        timestamp: new Date().toISOString(),
        database: {
            status: dbOk ? "connected" : "disconnected",
            latency: `${dbLatency}ms`,
        },
        memory: {
            heapUsed: Math.round(mem.heapUsed / 1024 / 1024) + "MB",
            heapTotal: Math.round(mem.heapTotal / 1024 / 1024) + "MB",
            rss: Math.round(mem.rss / 1024 / 1024) + "MB",
        },
        node: process.version,
        environment: process.env.NODE_ENV ?? "development",
    });
}
//# sourceMappingURL=health.controller.js.map