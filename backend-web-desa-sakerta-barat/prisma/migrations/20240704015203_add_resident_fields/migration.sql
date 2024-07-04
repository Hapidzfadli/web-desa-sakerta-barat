/*
  Warnings:

  - You are about to alter the column `firstName` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(100)` to `VarChar(50)`.
  - You are about to alter the column `lastName` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(100)` to `VarChar(50)`.

*/
-- AlterTable
ALTER TABLE `residents` ADD COLUMN `district` VARCHAR(50) NULL,
    ADD COLUMN `familyCardNumber` VARCHAR(20) NULL,
    ADD COLUMN `gender` ENUM('LAKI_LAKI', 'PEREMPUAN') NULL,
    ADD COLUMN `maritalStatus` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `nationality` VARCHAR(50) NULL,
    ADD COLUMN `occupation` VARCHAR(50) NULL,
    ADD COLUMN `placeOfBirth` VARCHAR(100) NULL,
    ADD COLUMN `postalCode` VARCHAR(10) NULL,
    ADD COLUMN `province` VARCHAR(50) NULL,
    ADD COLUMN `regency` VARCHAR(50) NULL,
    ADD COLUMN `religion` VARCHAR(50) NULL,
    MODIFY `idCardAddress` VARCHAR(255) NOT NULL,
    MODIFY `residentialAddress` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `isVerified` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `firstName` VARCHAR(50) NOT NULL,
    MODIFY `lastName` VARCHAR(50) NULL;
