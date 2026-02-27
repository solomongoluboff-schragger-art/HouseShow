-- CreateEnum
CREATE TYPE "ProposalStatus" AS ENUM ('DRAFT', 'SENT', 'CONFIRMED');

-- CreateEnum
CREATE TYPE "ProposalVisibility" AS ENUM ('PUBLIC', 'LINK_ONLY');

-- CreateTable
CREATE TABLE "Conversation" (
    "id" TEXT NOT NULL,
    "hostUserId" TEXT NOT NULL,
    "artistUserId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "senderUserId" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Proposal" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "status" "ProposalStatus" NOT NULL DEFAULT 'DRAFT',
    "title" TEXT,
    "date" TIMESTAMP(3),
    "startTime" TEXT,
    "description" TEXT,
    "expectedAttendance" INTEGER,
    "setLengthMinutes" INTEGER,
    "loadInMinutes" INTEGER,
    "technicalRequirements" TEXT,
    "additionalNotes" TEXT,
    "visibility" "ProposalVisibility" NOT NULL DEFAULT 'PUBLIC',
    "ticketingEnabled" BOOLEAN NOT NULL DEFAULT false,
    "ticketPriceCents" INTEGER,

    CONSTRAINT "Proposal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "hostProfileId" TEXT,
    "artistProfileId" TEXT,
    "proposalId" TEXT NOT NULL,
    "publishedAt" TIMESTAMP(3) NOT NULL,
    "visibility" "ProposalVisibility" NOT NULL,
    "ticketingEnabled" BOOLEAN NOT NULL,
    "ticketPriceCents" INTEGER,
    "capacity" INTEGER,
    "address" TEXT,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Conversation_hostUserId_artistUserId_key" ON "Conversation"("hostUserId", "artistUserId");

-- CreateIndex
CREATE UNIQUE INDEX "Proposal_conversationId_key" ON "Proposal"("conversationId");

-- CreateIndex
CREATE UNIQUE INDEX "Event_proposalId_key" ON "Event"("proposalId");

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_hostUserId_fkey" FOREIGN KEY ("hostUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_artistUserId_fkey" FOREIGN KEY ("artistUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderUserId_fkey" FOREIGN KEY ("senderUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proposal" ADD CONSTRAINT "Proposal_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_hostProfileId_fkey" FOREIGN KEY ("hostProfileId") REFERENCES "HostProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_artistProfileId_fkey" FOREIGN KEY ("artistProfileId") REFERENCES "ArtistProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "Proposal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
