"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rsvpSchema = exports.updateEventSchema = exports.createEventSchema = void 0;
const zod_1 = require("zod");
const imageUrlSchema = zod_1.z.union([zod_1.z.string().url(), zod_1.z.string().startsWith("/")]);
exports.createEventSchema = zod_1.z.object({
    title: zod_1.z.string().min(1).max(200),
    description: zod_1.z.string().max(2000).optional(),
    imageUrl: imageUrlSchema.optional(),
    location: zod_1.z.string().max(500).optional(),
    startDate: zod_1.z.string().datetime(),
    endDate: zod_1.z.string().datetime(),
});
exports.updateEventSchema = zod_1.z.object({
    title: zod_1.z.string().min(1).max(200).optional(),
    description: zod_1.z.string().max(2000).optional(),
    imageUrl: imageUrlSchema.optional(),
    location: zod_1.z.string().max(500).optional(),
    startDate: zod_1.z.string().datetime().optional(),
    endDate: zod_1.z.string().datetime().optional(),
});
exports.rsvpSchema = zod_1.z.object({
    status: zod_1.z.enum(["GOING", "MAYBE", "NOT_GOING"]),
});
//# sourceMappingURL=events.validation.js.map