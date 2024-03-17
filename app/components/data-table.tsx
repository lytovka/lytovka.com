import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
} from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Input } from "./ui/input";
import { useSearchParams } from "@remix-run/react";
import { Paragraph } from "./typography";
import { updateQueryParameterInCurrentHistoryEntry } from "~/utils/wishlist";

interface DataTableProps<TData, TValue> {
  columns: Array<ColumnDef<TData, TValue>>;
  data: Array<TData>;
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [searchParams] = useSearchParams();
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "price", desc: searchParams.get("sort") === "desc" },
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([
    { id: "name", value: searchParams.get("q") ?? "" },
  ]);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <>
      <Input
        className="max-w-sm"
        placeholder="Filter names..."
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
        onChange={(event) => {
          table.getColumn("name")?.setFilterValue(event.target.value);
          updateQueryParameterInCurrentHistoryEntry("q", event.target.value);
        }}
      />
      <div className="mt-4 rounded-md border border-black dark:border-white">
        <Table>
          <caption className="my-5 text-md text-black dark:text-white text-muted-foreground">
            Wishlist items.
          </caption>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                className="border-black dark:border-white"
                key={headerGroup.id}
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead className="text-xl " key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  className="border-black dark:border-white"
                  key={row.id}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      className="text-black dark:text-white text-xl"
                      key={cell.id}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  className="h-24 text-lg text-center text-black dark:text-white"
                  colSpan={columns.length}
                >
                  <Paragraph>
                    Looks like we&apos;ve hit a ghost town 🌵
                  </Paragraph>
                  <Paragraph>Try a different search query.</Paragraph>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
