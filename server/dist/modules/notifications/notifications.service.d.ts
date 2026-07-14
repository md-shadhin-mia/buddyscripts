export declare function createNotification(input: {
    userId: string;
    actorId: string;
    type: "FRIEND_REQUEST" | "FRIEND_ACCEPTED" | "POST_REACTION" | "POST_COMMENT" | "COMMENT_REPLY" | "EVENT_INVITE";
    entityType: "POST" | "COMMENT" | "FRIEND_REQUEST" | "EVENT";
    entityId: string;
}): Promise<{
    actor: {
        avatar: string | null;
        id: string;
        name: string;
    };
} & {
    id: string;
    userId: string;
    actorId: string;
    type: import("../../generated/prisma").$Enums.NotificationType;
    entityType: import("../../generated/prisma").$Enums.NotificationEntityType;
    entityId: string;
    message: string | null;
    isRead: boolean;
    createdAt: Date;
}>;
export declare function getNotifications(userId: string, params: {
    cursor?: string;
    take?: number;
}): Promise<{
    data: ({
        actor: {
            avatar: string | null;
            id: string;
            name: string;
        };
    } & {
        id: string;
        userId: string;
        actorId: string;
        type: import("../../generated/prisma").$Enums.NotificationType;
        entityType: import("../../generated/prisma").$Enums.NotificationEntityType;
        entityId: string;
        message: string | null;
        isRead: boolean;
        createdAt: Date;
    })[];
    nextCursor: string | null;
    hasMore: boolean;
    total: number;
}>;
export declare function getUnreadCount(userId: string): Promise<number>;
export declare function markAsRead(userId: string, notificationId: string): Promise<void>;
export declare function markAllAsRead(userId: string): Promise<void>;
//# sourceMappingURL=notifications.service.d.ts.map