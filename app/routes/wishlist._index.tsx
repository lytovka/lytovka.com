import type { MetaFunction } from "@remix-run/node";
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
import { CLOUDINARY_BASE_URL } from "~/constants";
import type { RootLoaderDataUnwrapped } from "~/root";
import {
  getMetadataUrl,
  getPreviewUrl,
  getSocialImagePreview,
  getSocialMetas,
} from "~/utils/seo";

const WishlistEntrySchema = z.object({
  id: z.string(),
  name: z.string(),
  link: z.string(),
  price: z.instanceof(Prisma.Decimal).transform((p) => p.toNumber()),
  status: z.enum(["Wanted", "Received", "Fulfilled"]),
  tags: z.string().nullable(),
  updatedAt: z.date().transform((d) => d.toISOString()),
});

export type WishlistEntrySchemaType = z.infer<typeof WishlistEntrySchema>;

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

export const meta: MetaFunction<typeof loader> = ({ matches }) => {
  const { requestInfo } = (matches[0] as RootLoaderDataUnwrapped).data;
  const metadataUrl = getMetadataUrl(requestInfo);

  return [
    {
      name: "viewport",
      content: "width=device-width,initial-scale=1,viewport-fit=cover",
    },
    ...getSocialMetas({
      title: "Ivan's wishlist",
      description: "All the stuff Ivan wants to buy",
      keywords: "wishlist, ivan lytovka, lytovka",
      url: metadataUrl,
      image: getSocialImagePreview({
        title: "wishlist",
        url: getPreviewUrl(metadataUrl),
        featuredImage: "wishlist",
      }),
    }),
  ];
};

export default function WishlistPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <MainLayout>
      <div className="container mx-auto py-10">
        <DataTable columns={columns} data={data.wishlistEntries} />
      </div>
    </MainLayout>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  const parseError = (e: unknown) => {
    if (isRouteErrorResponse(e)) {
      console.error(e.data);

      return `${e.status} ${e.statusText}`;
    }
    if (e instanceof Error) {
      console.error(e);

      return e.message;
    }

    return "Unknown Error";
  };

  return (
    <MainLayout>
      <figure className="flex flex-col items-center">
        <img
          alt="Sad Stanley from The Office"
          src={`${CLOUDINARY_BASE_URL}/image/upload/v1703986825/sad-stanley.webp`}
        />
        <figcaption className="mt-4 text-2xl text-black dark:text-white text-center">
          {parseError(error)}
        </figcaption>
      </figure>
    </MainLayout>
  );
}
