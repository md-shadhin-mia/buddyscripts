import { z } from "zod";
export declare const createPostSchema: z.ZodObject<{
    content: z.ZodString;
    imageUrl: z.ZodOptional<z.ZodString>;
    visibility: z.ZodDefault<z.ZodEnum<{
        FRIENDS: "FRIENDS";
        PRIVATE: "PRIVATE";
        PUBLIC: "PUBLIC";
    }>>;
}, z.core.$strip>;
export declare const updatePostSchema: z.ZodObject<{
    content: z.ZodOptional<z.ZodString>;
    imageUrl: z.ZodOptional<z.ZodString>;
    visibility: z.ZodOptional<z.ZodEnum<{
        FRIENDS: "FRIENDS";
        PRIVATE: "PRIVATE";
        PUBLIC: "PUBLIC";
    }>>;
}, z.core.$strip>;
//# sourceMappingURL=posts.validation.d.ts.map