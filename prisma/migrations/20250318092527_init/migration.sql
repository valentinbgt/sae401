-- CreateTable
CREATE TABLE `Deadline` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `module` VARCHAR(191) NOT NULL,
    `titre` VARCHAR(191) NOT NULL,
    `timestamp` DATETIME(3) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `lieu` VARCHAR(191) NOT NULL,
    `prof` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `etendue` VARCHAR(191) NOT NULL,
    `auteur` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `historique` JSON NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
