/*
  Warnings:

  - You are about to alter the column `datetime` on the `Step` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - A unique constraint covering the columns `[id]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Step` MODIFY `datetime` DATETIME NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_id_key` ON `User`(`id`);
