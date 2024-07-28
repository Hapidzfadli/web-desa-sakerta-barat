/*
  Warnings:

  - You are about to drop the column `userId` on the `letter_requests` table. All the data in the column will be lost.
  - You are about to drop the column `archiveCategory` on the `printed_letters` table. All the data in the column will be lost.
  - You are about to drop the column `archiveNotes` on the `printed_letters` table. All the data in the column will be lost.
  - You are about to drop the column `archivedAt` on the `printed_letters` table. All the data in the column will be lost.
  - You are about to drop the column `archivedBy` on the `printed_letters` table. All the data in the column will be lost.
  - You are about to drop the column `notificationSent` on the `printed_letters` table. All the data in the column will be lost.
  - You are about to drop the column `notificationSentAt` on the `printed_letters` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `letter_requests` DROP FOREIGN KEY `letter_requests_userId_fkey`;

-- DropForeignKey
ALTER TABLE `printed_letters` DROP FOREIGN KEY `printed_letters_archivedBy_fkey`;

-- AlterTable
ALTER TABLE `letter_requests` DROP COLUMN `userId`;

-- AlterTable
ALTER TABLE `printed_letters` DROP COLUMN `archiveCategory`,
    DROP COLUMN `archiveNotes`,
    DROP COLUMN `archivedAt`,
    DROP COLUMN `archivedBy`,
    DROP COLUMN `notificationSent`,
    DROP COLUMN `notificationSentAt`;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `phoneNumber` INTEGER NULL;

-- CreateTable
CREATE TABLE `archived_letters` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `letterRequestId` INTEGER NOT NULL,
    `archivedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `archivedBy` INTEGER NOT NULL,
    `archiveCategory` VARCHAR(50) NULL,
    `archiveNotes` TEXT NULL,
    `fileUrl` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `archived_letters_letterRequestId_key`(`letterRequestId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `archived_letters` ADD CONSTRAINT `archived_letters_letterRequestId_fkey` FOREIGN KEY (`letterRequestId`) REFERENCES `letter_requests`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `archived_letters` ADD CONSTRAINT `archived_letters_archivedBy_fkey` FOREIGN KEY (`archivedBy`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
