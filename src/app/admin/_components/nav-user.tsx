"use client";

import { ChevronsUpDown, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { signOut, useSession } from "next-auth/react";

export function NavUser() {
  const { isMobile } = useSidebar();
  const { data: session } = useSession();
  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent cursor-pointer data-[state=open]:text-sidebar-accent-foreground dark:bg-slate-700"
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={session?.user.image || "/icons/user.png"} alt={"user.name"} />
                </Avatar>
                <div className=" flex-1 text-left text-sm leading-tight hidden lg:grid">
                  <span className="truncate font-semibold">
                    {session?.user.name || "Utilisateur"}
                  </span>
                  <span className="truncate text-xs">
                    {session?.user.email || "vous êtes connecté"}
                  </span>
                </div>
                <ChevronsUpDown className="ml-auto size-4 lg:block hidden" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                   
                    <AvatarFallback className="rounded-lg">   {session?.user.username?.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {session?.user.username || "Utilisateur"}
                    </span>
                    <span className="truncate text-xs">
                      {session?.user.email || "vous êtes connecté"}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => signOut({ callbackUrl: "/admin/login" })}
                className="cursor-pointer"
              >
                <LogOut />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </>
  );
}
