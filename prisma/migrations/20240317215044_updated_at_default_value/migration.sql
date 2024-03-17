-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_WishlistEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "price" DECIMAL NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_WishlistEntry" ("createdAt", "id", "link", "name", "price", "status", "updatedAt") SELECT "createdAt", "id", "link", "name", "price", "status", "updatedAt" FROM "WishlistEntry";
DROP TABLE "WishlistEntry";
ALTER TABLE "new_WishlistEntry" RENAME TO "WishlistEntry";
CREATE UNIQUE INDEX "WishlistEntry_name_key" ON "WishlistEntry"("name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
