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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const env_1 = require("./config/env");
const auth_routes_1 = __importDefault(require("./modules/auth/auth.routes"));
const users_routes_1 = __importDefault(require("./modules/users/users.routes"));
const posts_routes_1 = __importDefault(require("./modules/posts/posts.routes"));
const comments_routes_1 = __importDefault(require("./modules/comments/comments.routes"));
const reactions_routes_1 = __importDefault(require("./modules/reactions/reactions.routes"));
const stories_routes_1 = __importDefault(require("./modules/stories/stories.routes"));
const friends_routes_1 = __importDefault(require("./modules/friends/friends.routes"));
const friend_requests_routes_1 = __importDefault(require("./modules/friends/friend-requests.routes"));
const notifications_routes_1 = __importDefault(require("./modules/notifications/notifications.routes"));
const events_routes_1 = __importDefault(require("./modules/events/events.routes"));
const upload_routes_1 = __importDefault(require("./modules/upload/upload.routes"));
const search_routes_1 = __importDefault(require("./modules/search/search.routes"));
const health_routes_1 = __importDefault(require("./modules/health/health.routes"));
const errorHandler_1 = require("./middleware/errorHandler");
const asyncHandler_1 = require("./lib/asyncHandler");
const uploadController = __importStar(require("./modules/upload/upload.controller"));
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({ origin: env_1.env.CORS_ORIGIN, credentials: true }));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use("/api/auth", auth_routes_1.default);
app.use("/api/users", users_routes_1.default);
app.use("/api/posts", posts_routes_1.default);
app.use("/api/posts", comments_routes_1.default);
app.use("/api", reactions_routes_1.default);
app.use("/api/stories", stories_routes_1.default);
app.use("/api/friends", friends_routes_1.default);
app.use("/api/friend-requests", friend_requests_routes_1.default);
app.use("/api/notifications", notifications_routes_1.default);
app.use("/api/events", events_routes_1.default);
app.use("/api/upload", upload_routes_1.default);
app.use("/api/search", search_routes_1.default);
app.get("/api/health", health_routes_1.default);
app.get("/api/files/*key", (0, asyncHandler_1.asyncHandler)(uploadController.serveFile));
app.use(errorHandler_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map