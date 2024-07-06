/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `letter_categories` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `letter_types` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `letter_categories_name_key` ON `letter_categories`(`name`);

-- CreateIndex
CREATE UNIQUE INDEX `letter_types_name_key` ON `letter_types`(`name`);
