-- CreateTable
CREATE TABLE "collection_item" (
    "id" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "collectionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "collection_item_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "collection_item_collectionId_idx" ON "collection_item"("collectionId");

-- AddForeignKey
ALTER TABLE "collection_item" ADD CONSTRAINT "collection_item_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;
