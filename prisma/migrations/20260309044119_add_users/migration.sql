-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'STOCKIST');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "tax_identification" TEXT NOT NULL,
    "phone_number" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'STOCKIST',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_tax_identification_key" ON "users"("tax_identification");
