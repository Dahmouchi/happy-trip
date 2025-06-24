/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Download, Star } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  function convertToCSV(data: any[]) {
    // Define the columns we want to export
    const columnsToExport = ["nom", "prenom", "email", "message"];

    // Create headers row
    const headers = columnsToExport.join(";");

    // Create data rows
    const rows = data.map((obj) =>
      columnsToExport
        .map((key) => {
          let value = obj[key] || "";

          // Convert to string if not already
          if (typeof value !== "string") {
            value = String(value);
          }

          // Escape quotes and handle accents
          return `"${
            value.replace(/"/g, '""').replace(/\n/g, " ") // Replace newlines with spaces
          }"`;
        })
        .join(";")
    );

    // Combine with UTF-8 BOM for Excel compatibility
    return "\uFEFF" + [headers, ...rows].join("\r\n");
  }
  const handleExport = () => {
    // Get all data (not just current page)
    const allData = table.getCoreRowModel().rows.map((row) => row.original);

    // Convert to CSV
    const csvContent = convertToCSV(allData);

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "export.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const table = useReactTable({
    data,
    columns,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="rounded-md border">
      <div className="flex items-center py-4 px-4 gap-2">
        <Input
          placeholder="Filtrer par le nom..."
          value={(table.getColumn("nom")?.getFilterValue() as string) ?? ""}
          onChange={(event) => {
            table.getColumn("nom")?.setFilterValue(event.target.value);
          }}
          className="max-w-sm"
        />
        <Button onClick={handleExport} variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Exporter CSV
        </Button>
      </div>
      <Table className="border-separate border-spacing-0">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row, idx) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className={idx % 2 === 1 ? "bg-lime-50" : ""}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {cell.column.id === "rating" ? (
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={
                              i < (row.getValue("rating") as number)
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300"
                            }
                            strokeWidth={1.5}
                          />
                        ))}
                      </div>
                    ) : (
                      flexRender(cell.column.columnDef.cell, cell.getContext())
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                Aucun résultat.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex items-center justify-end space-x-2 py-4 pr-4">
        <span className="text-sm text-muted-foreground">
          Page {table.getState().pagination.pageIndex + 1} sur{" "}
          {table.getPageCount()}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Précédent
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Suivant
        </Button>
      </div>
    </div>
  );
}
