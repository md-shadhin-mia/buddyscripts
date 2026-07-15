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
exports.createEvent = createEvent;
exports.getEvents = getEvents;
exports.getEvent = getEvent;
exports.updateEvent = updateEvent;
exports.deleteEvent = deleteEvent;
exports.rsvp = rsvp;
const eventsService = __importStar(require("./events.service"));
async function createEvent(req, res) {
    const event = await eventsService.createEvent(req.user.id, req.body);
    res.status(201).json({ status: "success", data: event });
}
async function getEvents(_req, res) {
    const events = await eventsService.getEvents();
    res.json({ status: "success", data: events });
}
async function getEvent(req, res) {
    const event = await eventsService.getEvent(req.params.id);
    res.json({ status: "success", data: event });
}
async function updateEvent(req, res) {
    const event = await eventsService.updateEvent(req.user.id, req.params.id, req.body);
    res.json({ status: "success", data: event });
}
async function deleteEvent(req, res) {
    await eventsService.deleteEvent(req.user.id, req.params.id);
    res.json({ status: "success", message: "Event deleted" });
}
async function rsvp(req, res) {
    const attendee = await eventsService.rsvp(req.user.id, req.params.id, req.body);
    res.json({ status: "success", data: attendee });
}
//# sourceMappingURL=events.controller.js.map