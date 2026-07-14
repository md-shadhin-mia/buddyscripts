import { z } from "zod";
export declare const createEventSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    imageUrl: z.ZodOptional<z.ZodString>;
    location: z.ZodOptional<z.ZodString>;
    startDate: z.ZodString;
    endDate: z.ZodString;
}, z.core.$strip>;
export declare const updateEventSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    imageUrl: z.ZodOptional<z.ZodString>;
    location: z.ZodOptional<z.ZodString>;
    startDate: z.ZodOptional<z.ZodString>;
    endDate: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const rsvpSchema: z.ZodObject<{
    status: z.ZodEnum<{
        GOING: "GOING";
        MAYBE: "MAYBE";
        NOT_GOING: "NOT_GOING";
    }>;
}, z.core.$strip>;
//# sourceMappingURL=events.validation.d.ts.map