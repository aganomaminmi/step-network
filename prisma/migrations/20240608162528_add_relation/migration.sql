/*
  Warnings:

  - A unique constraint covering the columns `[datetime,user_id]` on the table `Step` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_id` to the `Step` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Step_datetime_key` ON `Step`;

-- AlterTable
ALTER TABLE `Step` ADD COLUMN `user_id` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Step_datetime_user_id_key` ON `Step`(`datetime`, `user_id`);

-- AddForeignKey
ALTER TABLE `Step` ADD CONSTRAINT `Step_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
