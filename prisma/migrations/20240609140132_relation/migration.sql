/*
  Warnings:

  - You are about to alter the column `datetime` on the `Step` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `Step` MODIFY `datetime` DATETIME NOT NULL;

-- CreateTable
CREATE TABLE `UserRelationship` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `from_user_id` INTEGER NOT NULL,
    `target_user_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserRelationship` ADD CONSTRAINT `UserRelationship_from_user_id_fkey` FOREIGN KEY (`from_user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserRelationship` ADD CONSTRAINT `UserRelationship_target_user_id_fkey` FOREIGN KEY (`target_user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
