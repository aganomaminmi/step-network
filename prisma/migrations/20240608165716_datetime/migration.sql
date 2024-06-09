/*
  Warnings:

  - A unique constraint covering the columns `[datetime,user_id]` on the table `Step` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Step` MODIFY `datetime` DATETIME NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Step_datetime_user_id_key` ON `Step`(`datetime`, `user_id`);
