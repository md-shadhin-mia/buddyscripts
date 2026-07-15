interface CreateEventInput {
    title: string;
    description?: string;
    imageUrl?: string;
    location?: string;
    startDate: string;
    endDate: string;
}
interface UpdateEventInput {
    title?: string;
    description?: string;
    imageUrl?: string;
    location?: string;
    startDate?: string;
    endDate?: string;
}
export declare function createEvent(userId: string, input: CreateEventInput): Promise<{
    creator: {
        avatar: string | null;
        id: string;
        name: string;
    };
} & {
    id: string;
    title: string;
    description: string | null;
    imageUrl: string | null;
    location: string | null;
    startDate: Date;
    endDate: Date;
    creatorId: string;
    createdAt: Date;
    updatedAt: Date;
}>;
export declare function getEvents(): Promise<({
    _count: {
        attendees: number;
    };
} & {
    id: string;
    title: string;
    description: string | null;
    imageUrl: string | null;
    location: string | null;
    startDate: Date;
    endDate: Date;
    creatorId: string;
    createdAt: Date;
    updatedAt: Date;
})[]>;
export declare function getEvent(id: string): Promise<{
    attendees: ({
        user: {
            avatar: string | null;
            id: string;
            name: string;
        };
    } & {
        id: string;
        eventId: string;
        userId: string;
        status: import("../../generated/prisma").$Enums.EventAttendeeStatus;
        createdAt: Date;
    })[];
    creator: {
        avatar: string | null;
        id: string;
        name: string;
    };
} & {
    id: string;
    title: string;
    description: string | null;
    imageUrl: string | null;
    location: string | null;
    startDate: Date;
    endDate: Date;
    creatorId: string;
    createdAt: Date;
    updatedAt: Date;
}>;
export declare function updateEvent(userId: string, id: string, input: UpdateEventInput): Promise<{
    creator: {
        avatar: string | null;
        id: string;
        name: string;
    };
} & {
    id: string;
    title: string;
    description: string | null;
    imageUrl: string | null;
    location: string | null;
    startDate: Date;
    endDate: Date;
    creatorId: string;
    createdAt: Date;
    updatedAt: Date;
}>;
export declare function deleteEvent(userId: string, id: string): Promise<void>;
export declare function rsvp(userId: string, eventId: string, input: {
    status: "GOING" | "MAYBE" | "NOT_GOING";
}): Promise<{
    id: string;
    eventId: string;
    userId: string;
    status: import("../../generated/prisma").$Enums.EventAttendeeStatus;
    createdAt: Date;
}>;
export {};
//# sourceMappingURL=events.service.d.ts.map