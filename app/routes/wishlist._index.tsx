/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { json } from "@remix-run/node";
import {
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import { columns } from "~/components/columns";
import { DataTable } from "~/components/data-table";
import MainLayout from "~/components/main-layout";
import { prisma } from "~/server/db";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { H1, Paragraph } from "~/components/typography";
import { CLOUDINARY_BASE_URL } from "~/constants";

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
    throw new Response(result.error.message, {
      status: 400,
      statusText: "Bad Request",
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

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    console.error(error.data);

    return (
      <MainLayout>
        <figure>
          <img
            alt="Sad Stanley from The Office"
            src={`${CLOUDINARY_BASE_URL}/image/upload/v1703986825/sad-stanley.webp`}
          />
          <figcaption className="mt-4 text-2xl text-black dark:text-white text-center">
            {error.status} {error.statusText}
          </figcaption>
        </figure>
      </MainLayout>
    );
  } else if (error instanceof Error) {
    console.error(error);

    return (
      <MainLayout>
        <H1>Error</H1>
        <Paragraph>{error.message}</Paragraph>
      </MainLayout>
    );
  } else {
    return <H1>Unknown Error</H1>;
  }
}
