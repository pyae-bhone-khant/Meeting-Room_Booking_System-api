/*
  Warnings:

  - Added the required column `endDate` to the `booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roomNo` to the `booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roomType` to the `booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "booking" ADD COLUMN     "endDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "location" TEXT NOT NULL,
ADD COLUMN     "roomNo" TEXT NOT NULL,
ADD COLUMN     "roomType" TEXT NOT NULL,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL;
