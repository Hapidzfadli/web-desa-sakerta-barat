-- AlterTable
ALTER TABLE `users` MODIFY `role` ENUM('ADMIN', 'WARGA', 'KADES') NOT NULL DEFAULT 'WARGA';
