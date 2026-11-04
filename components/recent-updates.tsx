"use client"

import React, { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import type { Ticket } from "@/lib/types"
import { ArrowDown, ArrowUp, Clock, History, Minus } from "lucide-react"

interface RecentUpdatesProps {
  tickets: Ticket[]
}

export function RecentUpdates({ tickets }: RecentUpdatesProps) {
  const recentTickets = useMemo(() => {
    return [...tickets]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 5)
  }, [tickets])

  const getPriorityBadge = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return (
          <Badge variant="outline" className="text-[10px] h-5 gap-1 bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30">
            <ArrowUp className="h-2.5 w-2.5" />
            High
          </Badge>
        )
      case "medium":
        return (
          <Badge variant="outline" className="text-[10px] h-5 gap-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30">
            <Minus className="h-2.5 w-2.5" />
            Medium
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="text-[10px] h-5 gap-1 bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/30">
            <ArrowDown className="h-2.5 w-2.5" />
            Low
          </Badge>
        )
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Solved":
        return "bg-emerald-500"
      case "In Progress":
        return "bg-amber-500"
      case "On Hold":
        return "bg-purple-500"
      default:
        return "bg-slate-400"
    }
  }

  return (
    <Card className="mt-8 border border-border/70 bg-card/60 backdrop-blur-xs shadow-xs">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-primary" />
          <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
        </div>
        <CardDescription className="text-xs">
          The most recently modified tickets across your organization.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2.5 pt-1">
        {recentTickets.length === 0 ? (
          <div className="text-sm text-muted-foreground py-6 text-center">
            No recent activity recorded yet.
          </div>
        ) : (
          recentTickets.map((ticket) => (
            <div
              key={ticket.id}
              className="flex items-center justify-between gap-4 rounded-lg border border-border/50 bg-card/40 p-3 hover:bg-accent/40 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <Avatar className="h-8 w-8 border border-border/60 shrink-0">
                  <AvatarFallback className="text-xs bg-primary/10 text-primary font-medium">
                    {ticket.assignedToName
                      ? ticket.assignedToName.substring(0, 2).toUpperCase()
                      : "??"}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] text-muted-foreground">
                      #{ticket.ticketNumber}
                    </span>
                    <p className="text-sm font-medium text-foreground truncate">
                      {ticket.name}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                    <span className="inline-flex items-center gap-1.5">
                      <span className={`h-1.5 w-1.5 rounded-full ${getStatusColor(ticket.status)}`} />
                      {ticket.status}
                    </span>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1 text-[11px]">
                      <Clock className="h-3 w-3 opacity-60" />
                      {new Date(ticket.updatedAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="shrink-0">
                {getPriorityBadge(ticket.priority)}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
