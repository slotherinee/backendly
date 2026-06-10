-- AlterTable
ALTER TABLE "project" ADD COLUMN     "ipWhitelist" TEXT[] DEFAULT ARRAY[]::TEXT[];
