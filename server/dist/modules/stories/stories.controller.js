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
exports.createStory = createStory;
exports.getActiveStories = getActiveStories;
exports.deleteStory = deleteStory;
exports.viewStory = viewStory;
const storiesService = __importStar(require("./stories.service"));
async function createStory(req, res) {
    const story = await storiesService.createStory(req.user.id, req.body);
    res.status(201).json({ status: "success", data: story });
}
async function getActiveStories(req, res) {
    const stories = await storiesService.getActiveStories(req.user.id);
    res.json({ status: "success", data: stories });
}
async function deleteStory(req, res) {
    await storiesService.deleteStory(req.user.id, req.params.id);
    res.json({ status: "success", message: "Story deleted" });
}
async function viewStory(req, res) {
    await storiesService.viewStory(req.user.id, req.params.id);
    res.json({ status: "success", message: "Story viewed" });
}
//# sourceMappingURL=stories.controller.js.map