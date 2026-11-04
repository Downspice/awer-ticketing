"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { type LucideIcon } from "lucide-react"
 
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu, 
  SidebarMenuButton,
  SidebarMenuItem, 
} from "@/components/ui/sidebar"

export function NavSingleItems({
  singleItems,
}: {
  singleItems: {
    name: string
    url: string
    icon: LucideIcon
  }[]
}) { 
  const pathname = usePathname()

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3">
        Navigation
      </SidebarGroupLabel>
      <SidebarMenu className="gap-1 px-1">
        {singleItems.map((item) => {
          const isActive = pathname === item.url || (item.url !== "/" && pathname?.startsWith(item.url))
          return (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton 
                asChild 
                isActive={isActive} 
                tooltip={item.name}
                className={`transition-all rounded-lg font-medium text-sm ${
                  isActive 
                    ? "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary font-semibold" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
                }`}
              >
                <Link href={item.url} className="flex items-center gap-3 px-3 py-2">
                  <item.icon className={`h-4 w-4 shrink-0 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton> 
            </SidebarMenuItem>
          )
        })} 
      </SidebarMenu>
    </SidebarGroup>
  )
}
