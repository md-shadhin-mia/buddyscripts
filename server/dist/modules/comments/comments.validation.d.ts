import { z } from "zod";
export declare const createCommentSchema: z.ZodObject<{
    content: z.ZodString;
    media: z.ZodOptional<z.ZodArray<z.ZodObject<{
        url: z.ZodString;
        type: z.ZodEnum<{
            image: "image";
            video: "video";
        }>;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export declare const updateCommentSchema: z.ZodObject<{
    content: z.ZodString;
}, z.core.$strip>;
export declare const replySchema: z.ZodObject<{
    content: z.ZodString;
    media: z.ZodOptional<z.ZodArray<z.ZodObject<{
        url: z.ZodString;
        type: z.ZodEnum<{
            image: "image";
            video: "video";
        }>;
    }, z.core.$strip>>>;
}, z.core.$strip>;
//# sourceMappingURL=comments.validation.d.ts.map