-- AlterTable
ALTER TABLE "User"
ALTER COLUMN "email" DROP NOT NULL,
ADD COLUMN     "phoneNumber" TEXT,
ADD COLUMN     "firebaseUid" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_phoneNumber_key" ON "User"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "User_firebaseUid_key" ON "User"("firebaseUid");
