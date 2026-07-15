export declare function sendFriendRequest(senderId: string, receiverId: string): Promise<{
    sender: {
        avatar: string | null;
        id: string;
        name: string;
    };
} & {
    id: string;
    senderId: string;
    receiverId: string;
    status: import("../../generated/prisma").$Enums.FriendRequestStatus;
    createdAt: Date;
    updatedAt: Date;
}>;
export declare function acceptFriendRequest(userId: string, requestId: string): Promise<{
    id: string;
    user1Id: string;
    user2Id: string;
    createdAt: Date;
}>;
export declare function declineFriendRequest(userId: string, requestId: string): Promise<void>;
export declare function getPendingRequests(userId: string): Promise<({
    sender: {
        avatar: string | null;
        id: string;
        name: string;
    };
} & {
    id: string;
    senderId: string;
    receiverId: string;
    status: import("../../generated/prisma").$Enums.FriendRequestStatus;
    createdAt: Date;
    updatedAt: Date;
})[]>;
export declare function getSentRequests(userId: string): Promise<({
    receiver: {
        avatar: string | null;
        id: string;
        name: string;
    };
} & {
    id: string;
    senderId: string;
    receiverId: string;
    status: import("../../generated/prisma").$Enums.FriendRequestStatus;
    createdAt: Date;
    updatedAt: Date;
})[]>;
export declare function cancelFriendRequest(userId: string, requestId: string): Promise<void>;
export declare function getFriends(userId: string, params: {
    cursor?: string;
    take?: number;
}): Promise<{
    nextCursor: string | null;
    hasMore: boolean;
    data: {
        id: any;
        user1Id: any;
        user2Id: any;
        createdAt: any;
        friendId: any;
        friend: {
            avatar: string | null;
            id: string;
            name: string;
        } | undefined;
    }[];
}>;
export declare function unfriend(userId: string, friendId: string): Promise<void>;
export declare function getSuggestions(userId: string): Promise<{
    avatar: string | null;
    bio: string | null;
    id: string;
    name: string;
}[]>;
//# sourceMappingURL=friends.service.d.ts.map