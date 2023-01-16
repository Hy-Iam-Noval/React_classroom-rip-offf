-- DropForeignKey
ALTER TABLE `classes` DROP FOREIGN KEY `Classes_adminId_fkey`;

-- DropForeignKey
ALTER TABLE `members` DROP FOREIGN KEY `Members_classId_fkey`;

-- DropForeignKey
ALTER TABLE `taskcompletes` DROP FOREIGN KEY `TaskCompletes_taskId_fkey`;

-- DropForeignKey
ALTER TABLE `taskcompletes` DROP FOREIGN KEY `TaskCompletes_userId_fkey`;

-- DropForeignKey
ALTER TABLE `tasks` DROP FOREIGN KEY `Tasks_classId_fkey`;

-- DropForeignKey
ALTER TABLE `tasks` DROP FOREIGN KEY `Tasks_senderId_fkey`;

-- AlterTable
ALTER TABLE `classes` MODIFY `adminId` INTEGER NULL;

-- AlterTable
ALTER TABLE `members` MODIFY `classId` INTEGER NULL;

-- AlterTable
ALTER TABLE `taskcompletes` MODIFY `userId` INTEGER NULL,
    MODIFY `taskId` INTEGER NULL;

-- AlterTable
ALTER TABLE `tasks` MODIFY `senderId` INTEGER NULL,
    MODIFY `classId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Classes` ADD CONSTRAINT `Classes_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `Users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Members` ADD CONSTRAINT `Members_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `Classes`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tasks` ADD CONSTRAINT `Tasks_senderId_fkey` FOREIGN KEY (`senderId`) REFERENCES `Users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tasks` ADD CONSTRAINT `Tasks_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `Classes`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TaskCompletes` ADD CONSTRAINT `TaskCompletes_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TaskCompletes` ADD CONSTRAINT `TaskCompletes_taskId_fkey` FOREIGN KEY (`taskId`) REFERENCES `Tasks`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
