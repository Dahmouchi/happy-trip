/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";

import { redirect, usePathname, useRouter } from "next/navigation";
import { NavUser } from "./nav-user";
import {
  AlertCircle,
  Archive,
  Bell,
  BookMarked,
  BookOpen,
  Check,
  ChevronDown,
  FolderLock,
  House,
  KeySquare,
  LayoutDashboard,
  Settings2,
  SwatchBook,
  UserCheck,
  UserCog,
  Users,
} from "lucide-react";
import { getSession, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { fr } from "date-fns/locale";
import { toast } from "react-toastify";
import axios from "axios";
import { Badge } from "@/components/ui/badge";
import { GetAllNews } from "@/actions/saveLandingConfig";
const navMain = [
  {
    title: "Accueil",
    url: "overview",
    icon: House,
  },
  {
    title: "Users",
    url: "users",
    icon: Users,
  },
  {
    title: "Users Archive",
    url: "archive",
    icon: Archive,
  },
  {
    title: "Alertes",
    url: "alertes",
    icon: AlertCircle,
  },
  {
    title: "Settings",
    url: "settings",
    icon: Settings2,
  },
];

interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  relatedId: string;
  read: boolean;
  createdAt: Date;
  readAt?: Date;
}
const Header = () => {
  const pathname = usePathname();
  const lastSegment = pathname.split("/").filter(Boolean).pop() || "Home"; // Extract last segment
  const { data: session, update } = useSession();
  const page = navMain.find((cat) => cat.url === lastSegment);
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [newsletters, setNewsletters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  // Filter unread notifications or limit to 5


  return (
    <header className="flex h-16 rounded-lg border shadow-[-4px_5px_10px_0px_rgba(0,_0,_0,_0.1)]  mb-1 shrink-0 bg-white dark:bg-slate-900 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1 cursor-pointer" />
        <Separator
          orientation="vertical"
          className="mr-2 h-4 dark:bg-slate-50"
        />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="">
              <BreadcrumbLink href="/">HappyTrip</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage className="capitalize hidden lg:block">
                {page?.title}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="lg:pr-10 w-1/2 flex items-center justify-end gap-4">
       
        <div>
          {session?.user ? (
            <NavUser />
          ) : (
            <div>
              <Button
                onClick={() => redirect("/user")}
                className="gap-2.5 px-12"
              >
                <KeySquare /> S&apos;Identifier
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
