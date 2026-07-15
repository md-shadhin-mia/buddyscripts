import { z } from "zod";
export declare const createReactionSchema: z.ZodObject<{
    type: z.ZodEnum<{
        ANGRY: "ANGRY";
        HAHA: "HAHA";
        LIKE: "LIKE";
        LOVE: "LOVE";
        SAD: "SAD";
        WOW: "WOW";
    }>;
}, z.core.$strip>;
//# sourceMappingURL=reactions.validation.d.ts.map