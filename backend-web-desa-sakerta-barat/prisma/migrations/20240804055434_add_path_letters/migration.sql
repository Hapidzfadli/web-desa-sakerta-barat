-- AlterTable
ALTER TABLE `letter_requests` ADD COLUMN `approvedLetterPath` VARCHAR(191) NULL,
    ADD COLUMN `signedLetterPath` VARCHAR(191) NULL;
