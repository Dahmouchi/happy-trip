import { Shell } from "@/components/shells/shell";
import prisma from "@/lib/prisma";
import React from "react";
import { DataTable } from "../../_components/user-data-table/data-table";
import { columns } from "../../_components/user-data-table/columns";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const Users = async () => {
  let users: Awaited<ReturnType<typeof prisma.user.findMany>> = []; // Infer type from Prisma

  users = await prisma.user.findMany({
    where:{
      archive:false,
    },
    orderBy:{
      createdAt:"desc"
    }
  });
  
  return (
    <div className="overflow-hidden max-w-full p-2 ">
    <div className="flex items-center justify-between space-y-2">
      <h2 className="text-2xl font-bold tracking-tight">
        Liste des utilisateurs
      </h2>
      
    </div>

    <div className="relative w-full overflow-hidden mt-4">
        <ScrollArea className="w-full rounded-md border">
          <Shell className="p-0 sm:p-4">
            <DataTable data={users || []} columns={columns} />
          </Shell>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
</div>
  );
  
};

export default Users;
