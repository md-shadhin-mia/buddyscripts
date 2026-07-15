import { z } from "zod";
export declare const imageUrlSchema: z.ZodUnion<readonly [z.ZodString, z.ZodString]>;
export declare const mediaItemSchema: z.ZodObject<{
    url: z.ZodString;
    type: z.ZodEnum<{
        image: "image";
        video: "video";
    }>;
}, z.core.$strip>;
export declare const createPostSchema: z.ZodObject<{
    content: z.ZodString;
    imageUrl: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodString]>>;
    media: z.ZodOptional<z.ZodArray<z.ZodObject<{
        url: z.ZodString;
        type: z.ZodEnum<{
            image: "image";
            video: "video";
        }>;
    }, z.core.$strip>>>;
    visibility: z.ZodDefault<z.ZodEnum<{
        FRIENDS: "FRIENDS";
        PRIVATE: "PRIVATE";
        PUBLIC: "PUBLIC";
    }>>;
}, z.core.$strip>;
export declare const updatePostSchema: z.ZodObject<{
    content: z.ZodOptional<z.ZodString>;
    imageUrl: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodString]>>;
    visibility: z.ZodOptional<z.ZodEnum<{
        FRIENDS: "FRIENDS";
        PRIVATE: "PRIVATE";
        PUBLIC: "PUBLIC";
    }>>;
}, z.core.$strip>;
//# sourceMappingURL=posts.validation.d.ts.map