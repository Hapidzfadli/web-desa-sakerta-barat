-- CreateTable
CREATE TABLE `printed_letters` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `letterRequestId` INTEGER NOT NULL,
    `printedAt` DATETIME(3) NOT NULL,
    `printedBy` INTEGER NOT NULL,
    `archivedAt` DATETIME(3) NULL,
    `archivedBy` INTEGER NULL,
    `notificationSent` BOOLEAN NOT NULL DEFAULT false,
    `notificationSentAt` DATETIME(3) NULL,
    `fileUrl` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `printed_letters` ADD CONSTRAINT `printed_letters_letterRequestId_fkey` FOREIGN KEY (`letterRequestId`) REFERENCES `letter_requests`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `printed_letters` ADD CONSTRAINT `printed_letters_printedBy_fkey` FOREIGN KEY (`printedBy`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `printed_letters` ADD CONSTRAINT `printed_letters_archivedBy_fkey` FOREIGN KEY (`archivedBy`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
