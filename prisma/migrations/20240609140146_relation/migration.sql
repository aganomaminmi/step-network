/*
  Warnings:

  - You are about to alter the column `datetime` on the `Step` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - A unique constraint covering the columns `[from_user_id,target_user_id]` on the table `UserRelationship` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Step` MODIFY `datetime` DATETIME NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `UserRelationship_from_user_id_target_user_id_key` ON `UserRelationship`(`from_user_id`, `target_user_id`);
