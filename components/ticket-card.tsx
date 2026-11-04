"use client"

import * as React from "react"
import { Card, CardContent, CardFooter, CardHeader } from "../components/ui/card"
import type { Ticket } from "../lib/types"
import { Badge } from "./ui/badge"
import { Avatar, AvatarFallback } from "./ui/avatar"
import { AlertTriangle, ArrowDown, ArrowUp, Calendar, Minus } from "lucide-react"

interface TicketCardProps {
  ticket: Ticket
  onClick: (ticket: Ticket) => void
}

export default function TicketCard({ ticket, onClick }: TicketCardProps) {
  const getPriorityConfig = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return {
          icon: ArrowUp,
          borderColor: "border-l-rose-500",
          badgeClass: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30",
        }
      case "medium":
        return {
          icon: Minus,
          borderColor: "border-l-amber-500",
          badgeClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
        }
      case "low":
        return {
          icon: ArrowDown,
          borderColor: "border-l-slate-400 dark:border-l-slate-500",
          badgeClass: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/30",
        }
      default:
        return {
          icon: AlertTriangle,
          borderColor: "border-l-primary",
          badgeClass: "bg-primary/10 text-primary border-primary/30",
        }
    }
  }

  const priorityConfig = getPriorityConfig(ticket.priority)
  const PriorityIcon = priorityConfig.icon

  const getInitials = (name?: string) => {
    if (!name) return "??"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  const formattedDate = new Date(ticket.createdAt).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  })

  return (
    <Card
      onClick={() => onClick(ticket)}
      className={`group cursor-pointer border border-border/70 bg-card hover:bg-accent/30 shadow-xs hover:shadow-md transition-all duration-200 border-l-4 ${priorityConfig.borderColor} hover:-translate-y-0.5 active:translate-y-0 select-none`}
    >
      <CardHeader className="p-3 pb-1.5 flex flex-row items-center justify-between space-y-0">
        <span className="font-mono text-[11px] font-semibold text-muted-foreground group-hover:text-primary transition-colors">
          #{ticket.ticketNumber}
        </span>
        <Badge
          variant="outline"
          className={`text-[10px] h-5 px-1.5 gap-1 font-medium capitalize border ${priorityConfig.badgeClass}`}
        >
          <PriorityIcon className="h-3 w-3" />
          {ticket.priority}
        </Badge>
      </CardHeader>

      <CardContent className="p-3 pt-1 pb-2">
        <h3 className="font-medium text-xs leading-snug text-card-foreground group-hover:text-primary transition-colors line-clamp-2">
          {ticket.name}
        </h3>
      </CardContent>

      <CardFooter className="p-3 pt-0 flex items-center justify-between text-muted-foreground">
        <div className="flex items-center gap-1.5 min-w-0">
          <Avatar className="h-5 w-5 border border-border/80">
            <AvatarFallback className="text-[9px] bg-primary/10 text-primary font-medium">
              {getInitials(ticket.assignedToName)}
            </AvatarFallback>
          </Avatar>
          <span className="text-[11px] truncate max-w-[90px] font-normal">
            {ticket.assignedToName || "Unassigned"}
          </span>
        </div>

        <div className="flex items-center gap-1 text-[10px] shrink-0 font-normal">
          <Calendar className="h-3 w-3 opacity-60" />
          <span>{formattedDate}</span>
        </div>
      </CardFooter>
    </Card>
  )
}
