"use client";

import { type LucideIcon } from "lucide-react";
import { usePathname } from "next/navigation"; // Import to get current route
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import clsx from "clsx"; // Utility for conditional classNames

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  const pathname = usePathname(); // Get the current route
  const {state,setOpenMobile} = useSidebar()

  // Function to remove the language prefix ("/fr" or "/en") from pathname
  const getPathWithoutLocale = (path: string) => {
    return path.replace(/^\/(fr|en)/, ""); // Removes the "/fr" or "/en" prefix
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Plate-forme</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const isActive =
          getPathWithoutLocale(pathname) === item.url ||
          (item.url !== "/admin/dashboard" && getPathWithoutLocale(pathname).startsWith(item.url));
        
          return (
            <Collapsible key={item.title} asChild  className="group/collapsible">
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <Link href={item.url}>
                    <SidebarMenuButton
                    onClick={()=>setOpenMobile(false)}
                      tooltip={item.title}
                      className={clsx(
                        "cursor-pointer transition-all rounded-lg duration-200 py-5",
                        isActive ? "bg-lime-600 shadow-[4px_6px_7px_0px_rgba(0,_0,_0,_0.1)]  text-white hover:bg-lime-700 hover:text-white  font-semibold" : "hover:bg-white dark:hover:bg-gray-800"
                      )}
                    >
                      <div  className={`${
                          isActive && state === "expanded" 
                            ? "bg-white rounded-md p-1.5 text-lime-600"
                            : ""
                        }`}>  {item.icon && <item.icon className="w-4 h-4"/>}</div>  
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </Link>
                </CollapsibleTrigger>
                
              </SidebarMenuItem>
              
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
