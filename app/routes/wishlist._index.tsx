import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { columns } from "~/components/columns";
import { DataTable } from "~/components/data-table";
import MainLayout from "~/components/main-layout";
import { prisma } from "~/server/db";

export const loader: LoaderFunction = async () => {
  const wishlistEntries = await prisma.$queryRaw`
    SELECT WishlistEntry.id, 
           WishlistEntry.name, 
           WishlistEntry.link, 
           WishlistEntry.linkText,
           WishlistEntry.price,
           WishlistEntry.status, 
           WishlistEntry.comments, 
           WishlistEntry.updatedAt,
           GROUP_CONCAT(Tag.name, ', ') AS tags
    FROM WishlistEntry
    LEFT JOIN WishlistEntryTag ON wishlistEntryId = WishlistEntry.id
    LEFT JOIN Tag ON Tag.id = WishlistEntryTag.tagId
    GROUP BY WishlistEntry.id
    `;

  return json(wishlistEntries);
};

export default function DemoPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <MainLayout>
      <div className="container mx-auto py-10">
        <DataTable columns={columns} data={data} />
      </div>
    </MainLayout>
  );
}
