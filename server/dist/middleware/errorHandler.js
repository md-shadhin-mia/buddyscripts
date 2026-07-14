"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const errors_1 = require("../lib/errors");
const env_1 = require("../config/env");
function errorHandler(err, _req, res, _next) {
    if (err instanceof errors_1.ApiError) {
        res.status(err.statusCode).json({
            status: "error",
            message: err.message,
            ...(env_1.env.NODE_ENV === "development" && { stack: err.stack }),
        });
        return;
    }
    if (err.name === "PrismaClientKnownRequestError") {
        const prismaErr = err;
        if (prismaErr.code === "P2002") {
            res.status(409).json({ status: "error", message: "Resource already exists" });
            return;
        }
        if (prismaErr.code === "P2025") {
            res.status(404).json({ status: "error", message: "Resource not found" });
            return;
        }
    }
    console.error("Unhandled error:", err);
    res.status(500).json({
        status: "error",
        message: "Internal server error",
        ...(env_1.env.NODE_ENV === "development" && { stack: err.stack }),
    });
}
//# sourceMappingURL=errorHandler.js.map