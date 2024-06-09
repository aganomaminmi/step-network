/*
  Warnings:

  - You are about to alter the column `datetime` on the `Step` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - Added the required column `score` to the `UserRelationship` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Step` MODIFY `datetime` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `UserRelationship` ADD COLUMN `score` INTEGER NOT NULL;
