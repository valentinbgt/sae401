/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Deadline` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Deadline` table. All the data in the column will be lost.
  - You are about to alter the column `auteur` on the `Deadline` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `Deadline` DROP COLUMN `createdAt`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `attachments` VARCHAR(191) NULL,
    ADD COLUMN `tp` VARCHAR(191) NULL,
    MODIFY `auteur` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `statut` VARCHAR(191) NOT NULL,
    `nom` VARCHAR(191) NOT NULL,
    `prenom` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `avertissement` INTEGER NOT NULL,
    `limite` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Module` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(191) NOT NULL,
    `titre` VARCHAR(191) NOT NULL,
    `semestre` INTEGER NOT NULL,
    `profs` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Module_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Enseignement` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `moduleId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Deadline` ADD CONSTRAINT `Deadline_auteur_fkey` FOREIGN KEY (`auteur`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Deadline` ADD CONSTRAINT `Deadline_module_fkey` FOREIGN KEY (`module`) REFERENCES `Module`(`code`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Enseignement` ADD CONSTRAINT `Enseignement_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Enseignement` ADD CONSTRAINT `Enseignement_moduleId_fkey` FOREIGN KEY (`moduleId`) REFERENCES `Module`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
