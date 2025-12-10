/*
  Warnings:

  - Added the required column `address` to the `locations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "locations" ADD COLUMN     "address" TEXT NOT NULL;
