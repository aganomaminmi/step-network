/*
  Warnings:

  - You are about to alter the column `datetime` on the `Step` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `Step` MODIFY `datetime` DATETIME NOT NULL;
