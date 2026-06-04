/*
  Warnings:

  - You are about to drop the column `deslikes` on the `comentario` table. All the data in the column will be lost.
  - You are about to drop the column `likes` on the `comentario` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `comentario` DROP COLUMN `deslikes`,
    DROP COLUMN `likes`;

-- CreateTable
CREATE TABLE `ReacaoComentario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `commentId` INTEGER NOT NULL,
    `type` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `ReacaoComentario_userId_commentId_key`(`userId`, `commentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ReacaoComentario` ADD CONSTRAINT `ReacaoComentario_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReacaoComentario` ADD CONSTRAINT `ReacaoComentario_commentId_fkey` FOREIGN KEY (`commentId`) REFERENCES `Comentario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
