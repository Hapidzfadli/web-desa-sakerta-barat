/*
  Warnings:

  - Made the column `template` on table `letter_types` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `letter_types` MODIFY `template` TEXT NOT NULL;
