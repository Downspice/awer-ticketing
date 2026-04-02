"use client"

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "../components/ui/card"
import type { Ticket } from "../lib/types"
import { Badge } from "./ui/badge"
import { Avatar, AvatarFallback } from "./ui/avatar"

interface TicketCardProps {
  ticket: Ticket
  onClick: (ticket: Ticket) => void
}

export default function TicketCard({ ticket, onClick }: TicketCardProps) {
  const getPriorityVariant = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "var(--color-destructive, #ef4444)"
      case "medium":
        return "#eab308" // yellow-500
      case "low":
        return "var(--color-primary, #3b82f6)"
      default:
        return "transparent"
    }
  }

  const getInitials = (name?: string) => {
    if (!name) return "??"
    return name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2)
  }

  return (
    <Card 
      onClick={() => onClick(ticket)}
      className="cursor-pointer bg-card/80 backdrop-blur-sm border border-border hover:bg-card/90 hover:shadow-md transition-all border-l-4 group"
      style={{ borderLeftColor: getPriorityColor(ticket.priority) }}
    >
      <CardHeader className="p-3 pb-2 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-xs font-semibold text-muted-foreground">
            #{ticket.ticketNumber}
        </CardTitle>
        <Badge variant={getPriorityVariant(ticket.priority) as "default" | "secondary" | "destructive" | "outline"} className="text-[10px] h-5 px-1.5 leading-none font-medium">
            {ticket.priority}
        </Badge>
      </CardHeader>
      
      <CardContent className="p-3 pt-0">
        <h3 className="font-medium text-sm leading-tight text-card-foreground group-hover:text-primary transition-colors line-clamp-2">
            {ticket.name}
        </h3>
      </CardContent>
      
      <CardFooter className="p-3 pt-0 flex items-center justify-between">
         <div className="flex items-center space-x-2">
           <Avatar className="h-6 w-6 border border-primary/10">
              <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-medium">
                  {getInitials(ticket.assignedToName)}
              </AvatarFallback>
           </Avatar>
           <span className="text-[10px] text-muted-foreground truncate max-w-[80px]">
               {ticket.assignedToName || "Unassigned"}
           </span>
         </div>
         <span className="text-[10px] text-muted-foreground whitespace-nowrap">
             {new Date(ticket.createdAt).toLocaleDateString()}
         </span>
      </CardFooter>
    </Card>
  )
}


