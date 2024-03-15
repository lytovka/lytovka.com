/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { columns } from "~/components/columns";
import { DataTable } from "~/components/data-table";
import MainLayout from "~/components/main-layout";
import { prisma } from "~/server/db";
import { z } from "zod";
import { Prisma } from "@prisma/client";

const WishlistEntrySchema = z.object({
  id: z.string(),
  name: z.string(),
  link: z.string(),
  price: z.instanceof(Prisma.Decimal).transform((p) => p.toNumber()),
  status: z.enum(["Wanted", "Received", "Fulfilled"]),
  updatedAt: z.date(),
});

const WishlistEntriesSchema = z.array(WishlistEntrySchema);

export async function loader() {
  const wishlistEntriesRaw = await prisma.$queryRaw`
SELECT WishlistEntry.id, 
WishlistEntry.name, 
WishlistEntry.link, 
WishlistEntry.price,
WishlistEntry.status, 
WishlistEntry.updatedAt,
GROUP_CONCAT(Tag.name, ', ') AS tags
FROM WishlistEntry
LEFT JOIN WishlistEntryTag ON wishlistEntryId = WishlistEntry.id
LEFT JOIN Tag ON Tag.id = WishlistEntryTag.tagId
GROUP BY WishlistEntry.id
`;

  const result = WishlistEntriesSchema.safeParse(wishlistEntriesRaw);

  if (!result.success) {
    return json({ status: "error", error: result.error.message } as const, {
      status: 400,
    });
  }

  return json({ wishlistEntries: result.data } as const);
}

export default function WishlistPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <MainLayout>
      <div className="container mx-auto py-10">
        {/* @ts-ignore  figure out how to disambiguate error response from success response */}
        <DataTable columns={columns} data={data.wishlistEntries} />
      </div>
    </MainLayout>
  );
}
