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
exports.reactToPost = reactToPost;
exports.removePostReaction = removePostReaction;
exports.getPostReactions = getPostReactions;
exports.reactToComment = reactToComment;
exports.removeCommentReaction = removeCommentReaction;
const reactionsService = __importStar(require("./reactions.service"));
async function reactToPost(req, res) {
    const reaction = await reactionsService.reactToPost(req.user.id, req.params.postId, req.body);
    res.status(201).json({ status: "success", data: reaction });
}
async function removePostReaction(req, res) {
    await reactionsService.removePostReaction(req.user.id, req.params.postId);
    res.json({ status: "success", message: "Reaction removed" });
}
async function getPostReactions(req, res) {
    const reactions = await reactionsService.getPostReactions(req.params.postId);
    res.json({ status: "success", data: reactions });
}
async function reactToComment(req, res) {
    const reaction = await reactionsService.reactToComment(req.user.id, req.params.commentId, req.body);
    res.status(201).json({ status: "success", data: reaction });
}
async function removeCommentReaction(req, res) {
    await reactionsService.removeCommentReaction(req.user.id, req.params.commentId);
    res.json({ status: "success", message: "Reaction removed" });
}
//# sourceMappingURL=reactions.controller.js.map