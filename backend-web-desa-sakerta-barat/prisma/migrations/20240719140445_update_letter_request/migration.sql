/*
  Warnings:

  - You are about to drop the column `verifiedAt` on the `letter_requests` table. All the data in the column will be lost.
  - You are about to drop the column `verifiedBy` on the `letter_requests` table. All the data in the column will be lost.
  - The values [PROCESSING,VERIFIED] on the enum `letter_status_history_status` will be removed. If these variants are still used in the database, this will fail.
  - The values [PROCESSING,VERIFIED] on the enum `letter_status_history_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- DropForeignKey
ALTER TABLE `letter_requests` DROP FOREIGN KEY `letter_requests_verifiedBy_fkey`;

-- AlterTable
ALTER TABLE `letter_requests` DROP COLUMN `verifiedAt`,
    DROP COLUMN `verifiedBy`,
    ADD COLUMN `userId` INTEGER NULL,
    MODIFY `status` ENUM('SUBMITTED', 'APPROVED', 'REJECTED', 'SIGNED', 'COMPLETED', 'ARCHIVED') NOT NULL DEFAULT 'SUBMITTED';

-- AlterTable
ALTER TABLE `letter_status_history` MODIFY `status` ENUM('SUBMITTED', 'APPROVED', 'REJECTED', 'SIGNED', 'COMPLETED', 'ARCHIVED') NOT NULL;

-- AddForeignKey
ALTER TABLE `letter_requests` ADD CONSTRAINT `letter_requests_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
