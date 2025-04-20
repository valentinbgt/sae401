/*
  Warnings:

  - A unique constraint covering the columns `[icsToken]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `User` ADD COLUMN `icsToken` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_icsToken_key` ON `User`(`icsToken`);
