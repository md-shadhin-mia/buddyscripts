"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const node_cron_1 = __importDefault(require("node-cron"));
const app_1 = __importDefault(require("./app"));
const env_1 = require("./config/env");
const socket_1 = require("./socket");
const storyCleanup_1 = require("./jobs/storyCleanup");
const notificationCleanup_1 = require("./jobs/notificationCleanup");
const httpServer = (0, http_1.createServer)(app_1.default);
(0, socket_1.initSocket)(httpServer);
node_cron_1.default.schedule("0 * * * *", () => {
    (0, storyCleanup_1.cleanExpiredStories)();
});
node_cron_1.default.schedule("0 3 * * *", () => {
    (0, notificationCleanup_1.cleanOldNotifications)();
});
httpServer.listen(env_1.env.PORT, () => {
    console.log(`Server running on port ${env_1.env.PORT} in ${env_1.env.NODE_ENV} mode`);
});
exports.default = httpServer;
//# sourceMappingURL=server.js.map