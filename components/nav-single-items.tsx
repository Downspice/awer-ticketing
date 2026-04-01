"use client"

import { usePathname } from "next/navigation"
import { 
  type LucideIcon,
} from "lucide-react"
 
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
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Menus</SidebarGroupLabel>
      <SidebarMenu>
        {singleItems.map((item) => {
          const isActive = pathname === item.url || (item.url !== "/" && pathname?.startsWith(item.url))
          return (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton asChild isActive={isActive}>
                <a href={item.url}>
                  <item.icon />
                  <span>{item.name}</span>
                </a>
              </SidebarMenuButton> 
            </SidebarMenuItem>
          )
        })} 
      </SidebarMenu>
    </SidebarGroup>
  )
}
