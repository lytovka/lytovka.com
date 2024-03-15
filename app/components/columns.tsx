import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { dateFormatterShort } from "~/utils/date";
import { ExternalLink } from "./external-link";
import { updateQueryParameterInCurrentHistoryEntry } from "~/utils/wishlist";

export type Payment = {
  id: string;
  name: string;
  link: string;
  comments?: string;
  price: number;
  tags: string;
  status: "failed" | "pending" | "processing" | "success";
  updatedAt: string;
};

export const columns: Array<ColumnDef<Payment>> = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      return (
        <ExternalLink
          className="underline hover:opacity-75 transition-opacity text-black dark:text-white"
          href={row.original.link}
          rel="noreferrer noopener"
          target="__blank"
        >
          {row.original.name}
        </ExternalLink>
      );
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <button
          className="flex flex-row items-center"
          onClick={() => {
            const isSorted = column.getIsSorted();
            column.toggleSorting(isSorted === "asc");
            updateQueryParameterInCurrentHistoryEntry(
              "sort",
              isSorted === "asc" ? "desc" : "asc",
            );
          }}
        >
          Amount (USD)
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </button>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "tags",
    header: "Tags",
    cell: ({ row }) => {
      const tags = row.getValue("tags");

      return tags && typeof tags === "string" ? tags : "";
    },
  },
  {
    accessorKey: "updatedAt",
    header: "Updated At",
    cell: ({ row }) => {
      return dateFormatterShort.format(new Date(row.getValue("updatedAt")));
    },
  },
];
