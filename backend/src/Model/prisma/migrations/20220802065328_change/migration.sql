/*
  Warnings:

  - You are about to drop the column `img` on the `tasks` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `tasks` DROP COLUMN `img`,
    ADD COLUMN `comment` TEXT NULL,
    ADD COLUMN `file` TEXT NULL;
