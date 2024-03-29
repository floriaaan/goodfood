"use client";

import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
  create,
  refresh,
  noDataMessage,
}: DataTableProps<TData, TValue> & {
  create?: React.ReactNode;
  refresh?: React.ReactNode;
  noDataMessage?: string;
}) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <div className="w-full">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow className="bg-gray-100 hover:bg-gray-100" key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                return (
                  <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="whitespace-pre">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-sm text-neutral-600">
                  {noDataMessage || "Pas de données"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end gap-x-4 py-4">
        {refresh}
        {create}
        <Button
          variant="outline"
          className="h-11 w-11 border-2"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <MdChevronLeft className="h-4 w-4 shrink-0" />
        </Button>
        <span className="inline-flex h-11 w-11 items-center justify-center gap-x-2 border-2 p-3 text-sm font-bold uppercase">
          {table.getState().pagination.pageIndex + 1 || 0}/{table.getPageCount()}
        </span>
        <Button
          variant="outline"
          className="h-11 w-11 border-2"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <MdChevronRight className="h-4 w-4 shrink-0" />
        </Button>
      </div>
    </div>
  );
}
