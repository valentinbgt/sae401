/*
  Warnings:

  - You are about to drop the column `profs` on the `Module` table. All the data in the column will be lost.
  - You are about to drop the column `statut` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Enseignement` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `admin` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `prof` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Enseignement` DROP FOREIGN KEY `Enseignement_moduleId_fkey`;

-- DropForeignKey
ALTER TABLE `Enseignement` DROP FOREIGN KEY `Enseignement_userId_fkey`;

-- AlterTable
ALTER TABLE `Module` DROP COLUMN `profs`;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `statut`,
    ADD COLUMN `admin` BOOLEAN NOT NULL,
    ADD COLUMN `moduleId` INTEGER NULL,
    ADD COLUMN `prof` BOOLEAN NOT NULL;

-- DropTable
DROP TABLE `Enseignement`;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_moduleId_fkey` FOREIGN KEY (`moduleId`) REFERENCES `Module`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
