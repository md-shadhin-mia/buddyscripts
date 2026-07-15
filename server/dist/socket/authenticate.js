"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateSocket = authenticateSocket;
const jwt_1 = require("../lib/jwt");
function authenticateSocket(socket, next) {
    const token = socket.handshake.auth?.token ??
        socket.handshake.headers?.authorization?.replace("Bearer ", "");
    if (!token)
        return next(new Error("Authentication required"));
    try {
        const payload = (0, jwt_1.verifyAccessToken)(token);
        socket.data.userId = payload.sub;
        next();
    }
    catch {
        next(new Error("Invalid token"));
    }
}
//# sourceMappingURL=authenticate.js.map