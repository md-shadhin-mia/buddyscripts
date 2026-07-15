-- CreateTable
CREATE TABLE "CommentMedia" (
    "id" TEXT NOT NULL,
    "commentId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'image',
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "CommentMedia_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CommentMedia_commentId_idx" ON "CommentMedia"("commentId");

-- AddForeignKey
ALTER TABLE "CommentMedia" ADD CONSTRAINT "CommentMedia_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
