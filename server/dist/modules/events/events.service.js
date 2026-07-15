"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEvent = createEvent;
exports.getEvents = getEvents;
exports.getEvent = getEvent;
exports.updateEvent = updateEvent;
exports.deleteEvent = deleteEvent;
exports.rsvp = rsvp;
const database_1 = __importDefault(require("../../config/database"));
const errors_1 = require("../../lib/errors");
const eventInclude = {
    creator: { select: { id: true, name: true, avatar: true } },
};
async function createEvent(userId, input) {
    const event = await database_1.default.event.create({
        data: {
            title: input.title,
            description: input.description,
            imageUrl: input.imageUrl,
            location: input.location,
            startDate: new Date(input.startDate),
            endDate: new Date(input.endDate),
            creatorId: userId,
        },
        include: eventInclude,
    });
    return event;
}
async function getEvents() {
    const events = await database_1.default.event.findMany({
        where: { startDate: { gte: new Date() } },
        include: { _count: { select: { attendees: true } } },
        orderBy: { startDate: "asc" },
    });
    return events;
}
async function getEvent(id) {
    const event = await database_1.default.event.findUnique({
        where: { id },
        include: {
            creator: { select: { id: true, name: true, avatar: true } },
            attendees: {
                include: { user: { select: { id: true, name: true, avatar: true } } },
            },
        },
    });
    if (!event)
        throw errors_1.ApiError.notFound("Event not found");
    return event;
}
async function updateEvent(userId, id, input) {
    const event = await database_1.default.event.findUnique({ where: { id }, select: { creatorId: true } });
    if (!event)
        throw errors_1.ApiError.notFound("Event not found");
    if (event.creatorId !== userId)
        throw errors_1.ApiError.forbidden();
    const data = { ...input };
    if (input.startDate)
        data.startDate = new Date(input.startDate);
    if (input.endDate)
        data.endDate = new Date(input.endDate);
    const updated = await database_1.default.event.update({
        where: { id },
        data,
        include: eventInclude,
    });
    return updated;
}
async function deleteEvent(userId, id) {
    const event = await database_1.default.event.findUnique({ where: { id }, select: { creatorId: true } });
    if (!event)
        throw errors_1.ApiError.notFound("Event not found");
    if (event.creatorId !== userId)
        throw errors_1.ApiError.forbidden();
    await database_1.default.event.delete({ where: { id } });
}
async function rsvp(userId, eventId, input) {
    const attendee = await database_1.default.eventAttendee.upsert({
        where: { eventId_userId: { eventId, userId } },
        create: { eventId, userId, status: input.status },
        update: { status: input.status },
    });
    return attendee;
}
//# sourceMappingURL=events.service.js.map