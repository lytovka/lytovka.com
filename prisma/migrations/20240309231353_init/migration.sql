-- CreateTable
CREATE TABLE "WishlistEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "linkText" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "price" DECIMAL NOT NULL,
    "status" TEXT NOT NULL,
    "comments" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "WishlistEntryTag" (
    "wishlistEntryId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    CONSTRAINT "WishlistEntryTag_wishlistEntryId_fkey" FOREIGN KEY ("wishlistEntryId") REFERENCES "WishlistEntry" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "WishlistEntryTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "WishlistEntry_name_key" ON "WishlistEntry"("name");

-- CreateIndex
CREATE UNIQUE INDEX "WishlistEntryTag_wishlistEntryId_tagId_key" ON "WishlistEntryTag"("wishlistEntryId", "tagId");
