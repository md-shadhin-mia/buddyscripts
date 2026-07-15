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
exports.getFeed = getFeed;
exports.createPost = createPost;
exports.getPost = getPost;
exports.updatePost = updatePost;
exports.deletePost = deletePost;
exports.savePost = savePost;
exports.unsavePost = unsavePost;
exports.getSavedPosts = getSavedPosts;
const postsService = __importStar(require("./posts.service"));
async function getFeed(req, res) {
    const { cursor, take } = req.query;
    const result = await postsService.getFeed(req.user.id, { cursor, take: take ? Number(take) : undefined });
    res.json({ status: "success", data: result });
}
async function createPost(req, res) {
    const post = await postsService.createPost(req.user.id, req.body);
    res.status(201).json({ status: "success", data: post });
}
async function getPost(req, res) {
    const post = await postsService.getPost(req.params.id);
    res.json({ status: "success", data: post });
}
async function updatePost(req, res) {
    const post = await postsService.updatePost(req.user.id, req.params.id, req.body);
    res.json({ status: "success", data: post });
}
async function deletePost(req, res) {
    await postsService.deletePost(req.user.id, req.params.id);
    res.json({ status: "success", message: "Post deleted" });
}
async function savePost(req, res) {
    await postsService.savePost(req.user.id, req.params.id);
    res.status(201).json({ status: "success", message: "Post saved" });
}
async function unsavePost(req, res) {
    await postsService.unsavePost(req.user.id, req.params.id);
    res.json({ status: "success", message: "Post unsaved" });
}
async function getSavedPosts(req, res) {
    const { cursor, take } = req.query;
    const result = await postsService.getSavedPosts(req.user.id, { cursor, take: take ? Number(take) : undefined });
    res.json({ status: "success", data: result });
}
//# sourceMappingURL=posts.controller.js.map