interface CreateStoryInput {
    imageUrl: string;
    content?: string;
}
export declare function createStory(userId: string, input: CreateStoryInput): Promise<{
    author: {
        avatar: string | null;
        id: string;
        name: string;
    };
} & {
    id: string;
    imageUrl: string;
    content: string | null;
    authorId: string;
    viewCount: number;
    createdAt: Date;
}>;
export declare function getActiveStories(currentUserId: string): Promise<({
    author: {
        avatar: string | null;
        id: string;
        name: string;
    };
    viewers: {
        id: string;
        storyId: string;
        userId: string;
        viewedAt: Date;
    }[];
} & {
    id: string;
    imageUrl: string;
    content: string | null;
    authorId: string;
    viewCount: number;
    createdAt: Date;
})[]>;
export declare function deleteStory(userId: string, storyId: string): Promise<void>;
export declare function viewStory(userId: string, storyId: string): Promise<void>;
export {};
//# sourceMappingURL=stories.service.d.ts.map