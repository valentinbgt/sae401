-- CreateTable
CREATE TABLE `Deadline` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `auteur` INTEGER NOT NULL,
    `module` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `titre` VARCHAR(191) NOT NULL,
    `timestamp` DATETIME(3) NOT NULL,
    `lieu` VARCHAR(191) NOT NULL,
    `lieuDetails` VARCHAR(191) NULL,
    `prof` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `historique` JSON NOT NULL,
    `etendue` VARCHAR(191) NOT NULL,
    `tp` VARCHAR(191) NULL,
    `attachments` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `prof` BOOLEAN NOT NULL,
    `admin` BOOLEAN NOT NULL,
    `nom` VARCHAR(191) NOT NULL,
    `prenom` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `profilePicture` LONGTEXT NULL,
    `avertissement` INTEGER NOT NULL,
    `limite` INTEGER NOT NULL,
    `statut` VARCHAR(191) NOT NULL,
    `semestre` INTEGER NULL,
    `icsToken` VARCHAR(191) NULL,
    `moduleId` INTEGER NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_icsToken_key`(`icsToken`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Module` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(191) NOT NULL,
    `titre` VARCHAR(191) NOT NULL,
    `semestre` INTEGER NOT NULL,

    UNIQUE INDEX `Module_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Deadline` ADD CONSTRAINT `Deadline_auteur_fkey` FOREIGN KEY (`auteur`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Deadline` ADD CONSTRAINT `Deadline_module_fkey` FOREIGN KEY (`module`) REFERENCES `Module`(`code`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_moduleId_fkey` FOREIGN KEY (`moduleId`) REFERENCES `Module`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
