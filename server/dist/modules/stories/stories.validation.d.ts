import { z } from "zod";
export declare const createStorySchema: z.ZodObject<{
    imageUrl: z.ZodUnion<readonly [z.ZodString, z.ZodString]>;
    content: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
//# sourceMappingURL=stories.validation.d.ts.map