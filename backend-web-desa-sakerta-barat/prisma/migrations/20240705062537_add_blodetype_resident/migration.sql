-- AlterTable
ALTER TABLE `residents` ADD COLUMN `bloodType` ENUM('A', 'B', 'AB', 'O') NULL,
    ADD COLUMN `rt` INTEGER NULL,
    ADD COLUMN `rw` INTEGER NULL;
