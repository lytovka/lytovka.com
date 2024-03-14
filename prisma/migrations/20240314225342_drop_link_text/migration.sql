/*
  Warnings:

  - You are about to drop the column `linkText` on the `WishlistEntry` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_WishlistEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "price" DECIMAL NOT NULL,
    "status" TEXT NOT NULL,
    "comments" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_WishlistEntry" ("comments", "createdAt", "id", "link", "name", "price", "status", "updatedAt") SELECT "comments", "createdAt", "id", "link", "name", "price", "status", "updatedAt" FROM "WishlistEntry";
DROP TABLE "WishlistEntry";
ALTER TABLE "new_WishlistEntry" RENAME TO "WishlistEntry";
CREATE UNIQUE INDEX "WishlistEntry_name_key" ON "WishlistEntry"("name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
