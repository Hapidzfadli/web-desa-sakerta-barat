/*
  Warnings:

  - The values [PETUGAS] on the enum `users_role` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `letter_requests` MODIFY `status` ENUM('SUBMITTED', 'APPROVED', 'REJECTED', 'SIGNED', 'COMPLETED', 'ARCHIVED', 'REJECTED_BY_KADES') NOT NULL DEFAULT 'SUBMITTED';

-- AlterTable
ALTER TABLE `letter_status_history` MODIFY `status` ENUM('SUBMITTED', 'APPROVED', 'REJECTED', 'SIGNED', 'COMPLETED', 'ARCHIVED', 'REJECTED_BY_KADES') NOT NULL;

-- AlterTable
ALTER TABLE `users` MODIFY `role` ENUM('ADMIN', 'WARGA', 'KADES') NOT NULL DEFAULT 'WARGA';
