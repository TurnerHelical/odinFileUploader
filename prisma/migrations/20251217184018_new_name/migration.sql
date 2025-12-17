/*
  Warnings:

  - You are about to drop the column `name` on the `File` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[displayName,folderId,userId]` on the table `File` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `displayName` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `storedAs` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "File" DROP COLUMN "name",
ADD COLUMN     "displayName" TEXT NOT NULL,
ADD COLUMN     "storedAs" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "File_displayName_folderId_userId_key" ON "File"("displayName", "folderId", "userId");
