import React from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card"
import type { Ticket } from "../lib/types"
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Ticket as TicketIcon,
} from "lucide-react"

interface DashboardMetricsProps {
  tickets: Ticket[]
}

export function DashboardMetrics({ tickets }: DashboardMetricsProps) {
  const totalTickets = tickets.length
  const inProgressTickets = tickets.filter((t) => t.status === "In Progress").length
  const onHoldTickets = tickets.filter((t) => t.status === "On Hold").length
  const solvedTickets = tickets.filter((t) => t.status === "Solved").length
  const highPriorityTickets = tickets.filter(
    (t) => t.priority.toLowerCase() === "high"
  ).length
  const unassignedTickets = tickets.filter((t) => !t.assignedToId).length

  const metrics = [
    {
      title: "Total Tickets",
      value: totalTickets,
      description: "Across all projects",
      icon: TicketIcon,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-t-blue-500",
    },
    {
      title: "In Progress",
      value: inProgressTickets,
      description: "Actively being worked",
      icon: Activity,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
      borderColor: "border-t-amber-500",
    },
    {
      title: "On Hold",
      value: onHoldTickets,
      description: "Awaiting dependencies",
      icon: Clock,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      borderColor: "border-t-purple-500",
    },
    {
      title: "High Priority",
      value: highPriorityTickets,
      description: `${unassignedTickets} unassigned ticket${unassignedTickets !== 1 ? "s" : ""}`,
      icon: AlertTriangle,
      color: "text-rose-500",
      bgColor: "bg-rose-500/10",
      borderColor: "border-t-rose-500",
    },
    {
      title: "Solved",
      value: solvedTickets,
      description: "Successfully resolved",
      icon: CheckCircle2,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-t-emerald-500",
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 mb-8">
      {metrics.map((item) => {
        const Icon = item.icon
        return (
          <Card
            key={item.title}
            className={`border border-border/70 border-t-4 ${item.borderColor} bg-card/60 backdrop-blur-xs shadow-xs hover:shadow-md transition-all duration-200 hover:-translate-y-0.5`}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs font-medium text-muted-foreground">
                {item.title}
              </CardTitle>
              <div className={`p-1.5 rounded-lg ${item.bgColor}`}>
                <Icon className={`h-4 w-4 ${item.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tracking-tight text-foreground">
                {item.value}
              </div>
              <p className="text-[11px] text-muted-foreground mt-1 truncate">
                {item.description}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
