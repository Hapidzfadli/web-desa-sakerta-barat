-- CreateTable
CREATE TABLE `signatures` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `letterRequestId` INTEGER NOT NULL,
    `kadesId` INTEGER NOT NULL,
    `hash` VARCHAR(255) NOT NULL,
    `payload` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `signatures` ADD CONSTRAINT `signatures_letterRequestId_fkey` FOREIGN KEY (`letterRequestId`) REFERENCES `letter_requests`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `signatures` ADD CONSTRAINT `signatures_kadesId_fkey` FOREIGN KEY (`kadesId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
