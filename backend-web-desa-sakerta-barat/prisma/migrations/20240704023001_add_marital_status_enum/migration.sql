/*
  Warnings:

  - You are about to alter the column `maritalStatus` on the `residents` table. The data in that column could be lost. The data in that column will be cast from `TinyInt` to `Enum(EnumId(1))`.

*/
-- AlterTable
ALTER TABLE `residents` MODIFY `maritalStatus` ENUM('KAWIN', 'BELUM', 'JANDA', 'DUDA') NULL DEFAULT 'BELUM';
