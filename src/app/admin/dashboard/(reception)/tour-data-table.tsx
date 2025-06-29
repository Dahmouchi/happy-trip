 
// "use client"

// import {
//   ColumnDef,
//   flexRender,
//   getCoreRowModel,
//   getFilteredRowModel,
//   getPaginationRowModel,
//   useReactTable,
// } from "@tanstack/react-table";


// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table"
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button";
// import { useState } from "react";

// interface DataTableProps<TData, TValue> {
//   columns: ColumnDef<TData, TValue>[]
//   data: TData[]
// }

// export function DataTable<TData, TValue>({
//   columns,
//   data,
// }: DataTableProps<TData, TValue>) {

//   const [pagination, setPagination] = useState({
//     pageIndex: 0,
//     pageSize: 10,
//   });
  
//   const table = useReactTable({
//     data,
//     columns,
//     state: {
//       pagination,
//     },
//     onPaginationChange: setPagination,
//     getCoreRowModel: getCoreRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//   });

//   return (
//     <div className="rounded-md border ">
//       <div className="flex items-center py-4 px-4">
//        <Input
//          placeholder="Filtrer par titre de tour..."
//          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
//          onChange={(event) => {
//            console.log(event.target.value);
//            table.getColumn("title")?.setFilterValue(event.target.value);
//          }}
//          className="max-w-sm"
//        />
//           </div>
//       <Table className="border-separate border-spacing-0">
//         <TableHeader>
//           {table.getHeaderGroups().map((headerGroup) => (
//             <TableRow key={headerGroup.id}>
//               {headerGroup.headers.map((header) => {
//                 return (
//                   <TableHead key={header.id}>
//                     {header.isPlaceholder
//                       ? null
//                       : flexRender(
//                           header.column.columnDef.header,
//                           header.getContext()
//                         )}
                        
//                   </TableHead>
//                 )
//               })}
//             </TableRow>
//           ))}
          
//         </TableHeader>
//         <TableBody>
//           {table.getRowModel().rows?.length ? (
//             table.getRowModel().rows.map((row, idx) => (
//               <TableRow
//                 key={row.id}
//                 data-state={row.getIsSelected() && "selected"}
//                 className={idx % 2 === 1 ? "bg-lime-50" : ""}
//               >
//                 {row.getVisibleCells().map((cell) => {
//                   if (cell.column.id === 'priceOriginal') {
//                     return (
//                       <TableCell key={cell.id}>
//                         <div className="bg-lime-600 text-center text-white font-bold rounded-lg p-0.5">
//                           {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                         </div>
//                       </TableCell>
//                     );
//                   }
//                   if (cell.column.id === 'priceDiscounted') {
//                     return (
//                       <TableCell key={cell.id}>
//                         <div className="bg-orange-500 text-center text-white font-bold rounded-lg px-0.5">
//                           {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                         </div>
//                       </TableCell>
//                     );
//                   }
//                   return (
//                     <TableCell key={cell.id}>
//                       {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                     </TableCell>
//                   );
//                 })}
//               </TableRow>  ))
//           ) : (
//             <TableRow>
//               <TableCell colSpan={columns.length} className="h-24 text-center">
//                 Aucun résultat.
//               </TableCell>
//             </TableRow>
//           )}
//         </TableBody>  </Table>

//       <div className="flex items-center justify-end space-x-2 py-4 pr-4">
//        <span className="text-sm text-muted-foreground">
//          Page {table.getState().pagination.pageIndex + 1} sur{" "}
//          {table.getPageCount()}
//        </span>

//        <Button
//          variant="outline"
//          size="sm"
//          onClick={() => table.previousPage()}
//          disabled={!table.getCanPreviousPage()}
//        >
//          Précédent
//        </Button>
//        <Button
//          variant="outline"
//          size="sm"
//          onClick={() => table.nextPage()}
//          disabled={!table.getCanNextPage()}
//        >
//          Suivant
//        </Button>
//           </div>
//     </div>
//   )
// }


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
    <div className="rounded-md border shadow-lg">
      <div className="flex items-center py-4 px-4 bg-gradient-to-r from-blue-50 to-indigo-50">
       <Input
         placeholder="Filtrer par titre de tour..."
         value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
         onChange={(event) => {
           console.log(event.target.value);
           table.getColumn("title")?.setFilterValue(event.target.value);
         }}
         className="max-w-sm border-2 border-blue-200 focus:border-blue-400 transition-colors"
       />
      </div>
      <Table className="border-separate border-spacing-0">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="bg-gray-100 hover:bg-gray-200">
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} className="font-bold text-gray-800 border-b-2 border-gray-300">
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
                className={`transition-colors hover:bg-blue-50 ${idx % 2 === 1 ? "bg-lime-50" : "bg-white"}`}
              >
                {row.getVisibleCells().map((cell) => {
                  if (cell.column.id === 'priceOriginal') {
                    return (
                      <TableCell key={cell.id}>
                        <div className="bg-gradient-to-r from-lime-600 to-green-600 text-center text-white font-bold rounded px-1 py-0.5 shadow transform hover:scale-105 transition-transform text-sm">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </div>  </TableCell>
                    );
                  }
                  if (cell.column.id === 'priceDiscounted') {
                    return (
                      <TableCell key={cell.id}>
                        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-center text-white font-bold rounded px-1 py-0.5 shadow transform hover:scale-105 transition-transform text-sm">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </div>  </TableCell>
                    );
                  }
                            if (cell.column.id === 'advancedPrice') {
                            return (
                              <TableCell key={cell.id}>
                              <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-center text-white font-bold rounded px-1 py-0.5 shadow transform hover:scale-105 transition-transform text-sm">
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                              </div>
                              </TableCell>
                            );
                            }  return (
                    <TableCell key={cell.id} className="border-b border-gray-200">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center text-gray-500 italic">
                Aucun résultat.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between p-4 bg-gray-50 border-t">
        <span className="text-sm text-gray-600 font-medium">
          Page {table.getState().pagination.pageIndex + 1} sur{" "}
          {table.getPageCount()}
        </span>

        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="border-blue-300 text-blue-600 hover:bg-blue-50 disabled:opacity-50"
          >
            Précédent
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="border-blue-300 text-blue-600 hover:bg-blue-50 disabled:opacity-50"
          >
            Suivant
          </Button>
        </div>
      </div>
    </div>
  )
}
