-- CreateTable
CREATE TABLE "collection" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "publicMethods" TEXT[] DEFAULT ARRAY['GET']::TEXT[],
    "protectedMethods" TEXT[] DEFAULT ARRAY['POST', 'PATCH', 'DELETE']::TEXT[],
    "validationSchema" JSONB,
    "cacheEnabled" BOOLEAN NOT NULL DEFAULT false,
    "cacheTtl" INTEGER NOT NULL DEFAULT 60,
    "maxItems" INTEGER NOT NULL DEFAULT 500,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "collection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "collection_projectId_idx" ON "collection"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "collection_projectId_slug_key" ON "collection"("projectId", "slug");

-- AddForeignKey
ALTER TABLE "collection" ADD CONSTRAINT "collection_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
