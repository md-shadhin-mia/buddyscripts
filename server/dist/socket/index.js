"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSocket = initSocket;
exports.getIO = getIO;
const socket_io_1 = require("socket.io");
const env_1 = require("../config/env");
const authenticate_1 = require("./authenticate");
const presence_1 = require("./handlers/presence");
let io = null;
function initSocket(httpServer) {
    io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: env_1.env.CORS_ORIGIN,
            credentials: true,
        },
    });
    io.use(authenticate_1.authenticateSocket);
    io.on("connection", (socket) => {
        (0, presence_1.registerPresence)(io, socket);
    });
    return io;
}
function getIO() {
    return io;
}
//# sourceMappingURL=index.js.map