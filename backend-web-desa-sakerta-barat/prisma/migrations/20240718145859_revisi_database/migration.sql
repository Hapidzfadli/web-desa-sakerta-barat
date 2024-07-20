-- AlterTable
ALTER TABLE `letter_requests` ADD COLUMN `approvedAt` DATETIME(3) NULL,
    ADD COLUMN `approvedBy` INTEGER NULL,
    ADD COLUMN `completedAt` DATETIME(3) NULL,
    ADD COLUMN `completedBy` INTEGER NULL,
    ADD COLUMN `rejectionReason` TEXT NULL,
    ADD COLUMN `signedAt` DATETIME(3) NULL,
    ADD COLUMN `signedBy` INTEGER NULL,
    ADD COLUMN `verifiedAt` DATETIME(3) NULL,
    ADD COLUMN `verifiedBy` INTEGER NULL,
    MODIFY `status` ENUM('SUBMITTED', 'PROCESSING', 'VERIFIED', 'APPROVED', 'REJECTED', 'SIGNED', 'COMPLETED', 'ARCHIVED') NOT NULL DEFAULT 'SUBMITTED';

-- AlterTable
ALTER TABLE `letter_types` MODIFY `template` TEXT NULL;

-- AlterTable
ALTER TABLE `printed_letters` ADD COLUMN `archiveCategory` VARCHAR(50) NULL,
    ADD COLUMN `archiveNotes` TEXT NULL;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `digitalSignature` TEXT NULL,
    ADD COLUMN `signaturePin` VARCHAR(100) NULL,
    MODIFY `role` ENUM('ADMIN', 'WARGA', 'KADES', 'PETUGAS') NOT NULL DEFAULT 'WARGA';

-- CreateTable
CREATE TABLE `letter_status_history` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `letterRequestId` INTEGER NOT NULL,
    `status` ENUM('SUBMITTED', 'PROCESSING', 'VERIFIED', 'APPROVED', 'REJECTED', 'SIGNED', 'COMPLETED', 'ARCHIVED') NOT NULL,
    `changedBy` INTEGER NOT NULL,
    `notes` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `letter_versions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `letterRequestId` INTEGER NOT NULL,
    `versionNumber` INTEGER NOT NULL,
    `content` TEXT NOT NULL,
    `createdBy` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notifications` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `isRead` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `letter_requests` ADD CONSTRAINT `letter_requests_verifiedBy_fkey` FOREIGN KEY (`verifiedBy`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `letter_requests` ADD CONSTRAINT `letter_requests_approvedBy_fkey` FOREIGN KEY (`approvedBy`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `letter_requests` ADD CONSTRAINT `letter_requests_signedBy_fkey` FOREIGN KEY (`signedBy`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `letter_requests` ADD CONSTRAINT `letter_requests_completedBy_fkey` FOREIGN KEY (`completedBy`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `letter_status_history` ADD CONSTRAINT `letter_status_history_letterRequestId_fkey` FOREIGN KEY (`letterRequestId`) REFERENCES `letter_requests`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `letter_status_history` ADD CONSTRAINT `letter_status_history_changedBy_fkey` FOREIGN KEY (`changedBy`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `letter_versions` ADD CONSTRAINT `letter_versions_letterRequestId_fkey` FOREIGN KEY (`letterRequestId`) REFERENCES `letter_requests`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `letter_versions` ADD CONSTRAINT `letter_versions_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
