-- AlterTable
ALTER TABLE "ArtistProfile" ADD COLUMN     "availableForHire" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "images" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "memberCount" INTEGER,
ADD COLUMN     "needsSleep" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "rating" DOUBLE PRECISION,
ADD COLUMN     "responseTime" TEXT,
ADD COLUMN     "tagline" TEXT,
ADD COLUMN     "totalShows" INTEGER,
ADD COLUMN     "typicalDraw" TEXT,
ADD COLUMN     "upcomingTourDates" JSONB;

-- AlterTable
ALTER TABLE "HostProfile" ADD COLUMN     "amenities" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "artistSleep" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "availability" TEXT,
ADD COLUMN     "capacity" INTEGER,
ADD COLUMN     "images" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "rating" DOUBLE PRECISION,
ADD COLUMN     "responseTime" TEXT,
ADD COLUMN     "topGenres" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "totalShows" INTEGER,
ADD COLUMN     "venueType" TEXT;
