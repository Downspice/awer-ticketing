"use client"

import React, { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import type { Ticket } from "@/lib/types"

interface RecentUpdatesProps {
  tickets: Ticket[]
}

export function RecentUpdates({ tickets }: RecentUpdatesProps) {
  // Sort tickets globally by 'updatedAt' descending
  const recentTickets = useMemo(() => {
    return [...tickets].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, 5)
  }, [tickets])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "var(--color-destructive, #ef4444)"
      case "Medium": return "#eab308"
      case "Low": return "var(--color-primary, #3b82f6)"
      default: return "transparent"
    }
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Recent Updates</CardTitle>
        <CardDescription>The most recently modified tickets across the board.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {recentTickets.length === 0 ? (
          <div className="text-sm text-muted-foreground">No recent tasks.</div>
        ) : (
          recentTickets.map(ticket => (
            <div key={ticket.id} className="flex items-center gap-4 rounded-lg bg-muted/50 p-3 hover:bg-muted/80 transition-colors">
              <Avatar className="h-9 w-9 border">
                <AvatarFallback className="text-xs">
                  {ticket.assignedToName ? ticket.assignedToName.substring(0, 2).toUpperCase() : "??"}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">{ticket.name}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-2">
                  <span className="truncate max-w-[200px]">{ticket.status}</span>
                  <span>•</span>
                  <span>{new Date(ticket.updatedAt).toLocaleString()}</span>
                </p>
              </div>
              
              <Badge style={{ backgroundColor: getPriorityColor(ticket.priority), color: '#fff' }}>
                {ticket.priority}
              </Badge>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
