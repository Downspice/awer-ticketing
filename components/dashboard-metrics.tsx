import React from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card"
import type { Ticket } from "../lib/types"
import { Activity, AlertCircle, CheckCircle2, Clock, TicketIcon } from "lucide-react"

interface DashboardMetricsProps {
  tickets: Ticket[]
}

export function DashboardMetrics({ tickets }: DashboardMetricsProps) {
  const totalTickets = tickets.length;
  const inProgressTickets = tickets.filter(t => t.status === "In Progress").length;
  const onHoldTickets = tickets.filter(t => t.status === "On Hold").length;
  const solvedTickets = tickets.filter(t => t.status === "Solved").length;
  const highPriorityTickets = tickets.filter(t => t.priority.toLowerCase() === "high").length;
  const unassignedTickets = tickets.filter(t => !t.assignedToId).length;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 mb-8">
      <Card className="bg-card/50 backdrop-blur border-primary/20 hover:border-primary/50 transition-all shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Active</CardTitle>
          <TicketIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalTickets}</div>
          <p className="text-xs text-muted-foreground mt-1 text-primary/80">
            Across all projects
          </p>
        </CardContent>
      </Card>

      <Card className="bg-card/50 backdrop-blur border-yellow-500/20 hover:border-yellow-500/50 transition-all shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          <Activity className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{inProgressTickets}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Currently working
          </p>
        </CardContent>
      </Card>

      <Card className="bg-card/50 backdrop-blur border-[var(--on-hold)]/20 hover:border-[var(--on-hold)]/50 transition-all shadow-sm">
         <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">On Hold</CardTitle>
          <Clock className="h-4 w-4 text-[var(--on-hold)]" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{onHoldTickets}</div>
          <p className="text-xs text-muted-foreground mt-1 text-yellow-500/80">
            Needs attention soon
          </p>
        </CardContent>
      </Card>

      <Card className="bg-card/50 backdrop-blur border-red-500/20 hover:border-red-500/50 transition-all shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">High Priority</CardTitle>
          <AlertCircle className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{highPriorityTickets}</div>
          <p className="text-xs text-muted-foreground mt-1">
             {unassignedTickets} unassigned ticket{unassignedTickets !== 1 ? 's' : ''}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-card/50 backdrop-blur border-emerald-500/20 hover:border-emerald-500/50 transition-all shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
           <CardTitle className="text-sm font-medium">Solved</CardTitle>
           <CheckCircle2 className="h-4 w-4 text-emerald-500" />
        </CardHeader>
         <CardContent>
          <div className="text-2xl font-bold">{solvedTickets}</div>
          <p className="text-xs text-muted-foreground mt-1">
             Completed tasks
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
