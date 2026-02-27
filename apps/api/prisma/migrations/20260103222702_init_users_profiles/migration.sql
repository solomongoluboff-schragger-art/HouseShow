-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('FAN', 'ARTIST', 'HOST', 'ADMIN');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "passwordHash" TEXT,
    "roles" "UserRole"[] DEFAULT ARRAY['FAN']::"UserRole"[],

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArtistProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "displayName" TEXT NOT NULL,
    "bio" TEXT,
    "hometown" TEXT,
    "genres" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "spotifyArtistId" TEXT,
    "verifiedAt" TIMESTAMP(3),

    CONSTRAINT "ArtistProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HostProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "displayName" TEXT NOT NULL,
    "bio" TEXT,
    "city" TEXT,
    "neighborhood" TEXT,
    "videoVerificationUrl" TEXT,
    "verifiedAt" TIMESTAMP(3),

    CONSTRAINT "HostProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ArtistProfile_userId_key" ON "ArtistProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "HostProfile_userId_key" ON "HostProfile"("userId");

-- AddForeignKey
ALTER TABLE "ArtistProfile" ADD CONSTRAINT "ArtistProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HostProfile" ADD CONSTRAINT "HostProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
