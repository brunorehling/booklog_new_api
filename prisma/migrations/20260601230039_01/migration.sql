/*
  Warnings:

  - You are about to alter the column `name` on the `book` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(50)`.
  - You are about to alter the column `title` on the `review` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(50)`.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `author` to the `Book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rating` to the `Book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `content` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rate` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `comment` DROP FOREIGN KEY `Comment_UserId_fkey`;

-- DropForeignKey
ALTER TABLE `review` DROP FOREIGN KEY `Review_UserId_fkey`;

-- DropIndex
DROP INDEX `Comment_UserId_fkey` ON `comment`;

-- DropIndex
DROP INDEX `Review_UserId_fkey` ON `review`;

-- AlterTable
ALTER TABLE `book` ADD COLUMN `author` VARCHAR(50) NOT NULL,
    ADD COLUMN `rating` DOUBLE NOT NULL,
    MODIFY `name` VARCHAR(50) NOT NULL,
    MODIFY `description` VARCHAR(300) NOT NULL;

-- AlterTable
ALTER TABLE `comment` ADD COLUMN `reports` INTEGER NOT NULL DEFAULT 0,
    MODIFY `content` VARCHAR(200) NOT NULL,
    MODIFY `likes` INTEGER NOT NULL DEFAULT 0,
    MODIFY `deslikes` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `review` ADD COLUMN `content` VARCHAR(300) NOT NULL,
    ADD COLUMN `rate` INTEGER NOT NULL,
    MODIFY `title` VARCHAR(50) NOT NULL;

-- DropTable
DROP TABLE `user`;

-- CreateTable
CREATE TABLE `Usuario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(45) NOT NULL,
    `senha` VARCHAR(20) NOT NULL,
    `name` VARCHAR(50) NOT NULL,
    `description` VARCHAR(300) NOT NULL,
    `CreatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `UpdatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Review` ADD CONSTRAINT `Review_UserId_fkey` FOREIGN KEY (`UserId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_UserId_fkey` FOREIGN KEY (`UserId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
