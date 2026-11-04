"use client";

import * as React from "react";
import Link from "next/link";
import {
  Building2,
  FolderKanban,
  LayoutDashboard,
  Ticket,
  Users2,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavSingleItems } from "./nav-single-items";

const navigationItems = [
  {
    name: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Tickets",
    url: "/tickets",
    icon: Ticket,
  },
  {
    name: "Projects",
    url: "/projects",
    icon: FolderKanban,
  },
  {
    name: "Users",
    url: "/users",
    icon: Users2,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" className="border-r border-border/60" {...props}>
      <SidebarHeader className="border-b border-border/40 p-4">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs group-hover:scale-105 transition-transform">
            <Ticket className="h-5 w-5" />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="font-bold text-sm tracking-tight text-foreground">
              Awer Ticketing
            </span>
            <span className="text-[11px] text-muted-foreground">
              Issue Management
            </span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="p-2">
        <NavSingleItems singleItems={navigationItems} />
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
