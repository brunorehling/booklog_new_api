/*
  Warnings:

  - You are about to drop the `comment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `comment` DROP FOREIGN KEY `Comment_ReviewId_fkey`;

-- DropForeignKey
ALTER TABLE `comment` DROP FOREIGN KEY `Comment_UserId_fkey`;

-- AlterTable
ALTER TABLE `usuario` MODIFY `senha` VARCHAR(60) NOT NULL;

-- DropTable
DROP TABLE `comment`;

-- CreateTable
CREATE TABLE `Comentario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `UserId` INTEGER NOT NULL,
    `ReviewId` INTEGER NOT NULL,
    `content` VARCHAR(200) NOT NULL,
    `likes` INTEGER NOT NULL DEFAULT 0,
    `deslikes` INTEGER NOT NULL DEFAULT 0,
    `reports` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Comentario` ADD CONSTRAINT `Comentario_UserId_fkey` FOREIGN KEY (`UserId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comentario` ADD CONSTRAINT `Comentario_ReviewId_fkey` FOREIGN KEY (`ReviewId`) REFERENCES `Review`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
