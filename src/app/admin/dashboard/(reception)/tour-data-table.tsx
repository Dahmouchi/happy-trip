 
"use client"

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
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  
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
    <div className="rounded-md border ">
      <div className="flex items-center py-4 px-4">
       <Input
         placeholder="Filtrer par titre de tour..."
         value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
         onChange={(event) => {
           console.log(event.target.value);
           table.getColumn("title")?.setFilterValue(event.target.value);
         }}
         className="max-w-sm"
       />
          </div>
      <Table className="border-separate border-spacing-0">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        
                  </TableHead>
                )
              })}
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
                {row.getVisibleCells().map((cell) => {
                  if (cell.column.id === 'priceOriginal') {
                    return (
                      <TableCell key={cell.id}>
                        <div className="bg-lime-600 text-center text-white font-bold rounded-lg p-0.5">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </div>
                      </TableCell>
                    );
                  }
                  if (cell.column.id === 'priceDiscounted') {
                    return (
                      <TableCell key={cell.id}>
                        <div className="bg-orange-500 text-center text-white font-bold rounded-lg px-0.5">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </div>
                      </TableCell>
                    );
                  }
                  return (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  );
                })}
              </TableRow>  ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                Aucun résultat.
              </TableCell>
            </TableRow>
          )}
        </TableBody>  </Table>

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
  )
}