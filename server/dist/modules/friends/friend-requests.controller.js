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
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendFriendRequest = sendFriendRequest;
exports.acceptFriendRequest = acceptFriendRequest;
exports.declineFriendRequest = declineFriendRequest;
exports.getPendingRequests = getPendingRequests;
exports.getSentRequests = getSentRequests;
exports.cancelFriendRequest = cancelFriendRequest;
const friendsService = __importStar(require("./friends.service"));
async function sendFriendRequest(req, res) {
    const request = await friendsService.sendFriendRequest(req.user.id, req.body.receiverId);
    res.status(201).json({ status: "success", data: request });
}
async function acceptFriendRequest(req, res) {
    const friendship = await friendsService.acceptFriendRequest(req.user.id, req.params.id);
    res.json({ status: "success", data: friendship });
}
async function declineFriendRequest(req, res) {
    await friendsService.declineFriendRequest(req.user.id, req.params.id);
    res.json({ status: "success", message: "Friend request declined" });
}
async function getPendingRequests(req, res) {
    const requests = await friendsService.getPendingRequests(req.user.id);
    res.json({ status: "success", data: requests });
}
async function getSentRequests(req, res) {
    const requests = await friendsService.getSentRequests(req.user.id);
    res.json({ status: "success", data: requests });
}
async function cancelFriendRequest(req, res) {
    await friendsService.cancelFriendRequest(req.user.id, req.params.id);
    res.json({ status: "success", message: "Request cancelled" });
}
//# sourceMappingURL=friend-requests.controller.js.map