/*
  Warnings:

  - A unique constraint covering the columns `[datetime]` on the table `Step` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Step_datetime_key` ON `Step`(`datetime`);
