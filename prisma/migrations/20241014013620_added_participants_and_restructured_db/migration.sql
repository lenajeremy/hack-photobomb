/*
  Warnings:

  - You are about to drop the `_EventToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_EventToUser" DROP CONSTRAINT "_EventToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_EventToUser" DROP CONSTRAINT "_EventToUser_B_fkey";

-- DropForeignKey
ALTER TABLE "files" DROP CONSTRAINT "files_eventId_fkey";

-- AlterTable
ALTER TABLE "uploads" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- DropTable
DROP TABLE "_EventToUser";

-- CreateTable
CREATE TABLE "event_participants" (
    "userId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,

    CONSTRAINT "event_participants_pkey" PRIMARY KEY ("userId","eventId")
);

-- AddForeignKey
ALTER TABLE "event_participants" ADD CONSTRAINT "event_participants_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_participants" ADD CONSTRAINT "event_participants_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;
