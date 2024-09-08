-- AlterTable
ALTER TABLE `letter_types` ADD COLUMN `lastNumberUsed` INTEGER NULL DEFAULT 0,
    ADD COLUMN `letterNumberPrefix` VARCHAR(191) NULL,
    ADD COLUMN `letterNumberSuffix` VARCHAR(191) NULL;
