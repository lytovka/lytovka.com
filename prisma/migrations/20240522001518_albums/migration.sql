/*
  Warnings:

  - You are about to drop the `Albums` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Albums";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Album" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "spotifyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT
);
