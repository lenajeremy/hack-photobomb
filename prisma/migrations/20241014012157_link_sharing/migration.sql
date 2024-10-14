-- CreateTable
CREATE TABLE "share_links" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "share_links_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "share_links_link_key" ON "share_links"("link");

-- AddForeignKey
ALTER TABLE "share_links" ADD CONSTRAINT "share_links_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
