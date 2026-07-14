"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReactionSchema = void 0;
const zod_1 = require("zod");
exports.createReactionSchema = zod_1.z.object({
    type: zod_1.z.enum(["LIKE", "LOVE", "HAHA", "WOW", "SAD", "ANGRY"]),
});
//# sourceMappingURL=reactions.validation.js.map