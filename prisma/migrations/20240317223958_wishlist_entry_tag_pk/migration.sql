-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_WishlistEntryTag" (
    "wishlistEntryId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    PRIMARY KEY ("wishlistEntryId", "tagId"),
    CONSTRAINT "WishlistEntryTag_wishlistEntryId_fkey" FOREIGN KEY ("wishlistEntryId") REFERENCES "WishlistEntry" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "WishlistEntryTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_WishlistEntryTag" ("tagId", "wishlistEntryId") SELECT "tagId", "wishlistEntryId" FROM "WishlistEntryTag";
DROP TABLE "WishlistEntryTag";
ALTER TABLE "new_WishlistEntryTag" RENAME TO "WishlistEntryTag";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
