"use client"

import React, { useMemo } from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart"
import type { Ticket } from "@/lib/types"

interface DashboardChartsProps {
  tickets: Ticket[]
}

const statusConfig = {
  tickets: {
    label: "Tickets",
  },
  notStarted: {
    label: "Not Started",
    color: "var(--chart-1)",
  },
  inProgress: {
    label: "In Progress",
    color: "var(--chart-2)",
  },
  onHold: {
    label: "On Hold",
    color: "var(--chart-3)",
  },
  solved: {
    label: "Solved",
    color: "var(--chart-4)",
  },
}

const priorityConfig = {
  tickets: {
    label: "Tickets",
  },
  high: {
    label: "High",
    color: "var(--color-destructive, #ef4444)",
  },
  medium: {
    label: "Medium",
    color: "#eab308",
  },
  low: {
    label: "Low",
    color: "var(--color-primary, #3b82f6)",
  },
}

export function DashboardCharts({ tickets }: DashboardChartsProps) {
  const statusData = useMemo(() => {
    const counts = { "Not Started": 0, "In Progress": 0, "On Hold": 0, "Solved": 0 }
    tickets.forEach(t => {
      if (counts[t.status as keyof typeof counts] !== undefined) {
        counts[t.status as keyof typeof counts]++
      }
    })
    return [
      { status: "Not Started", tickets: counts["Not Started"], fill: "var(--color-notStarted)" },
      { status: "In Progress", tickets: counts["In Progress"], fill: "var(--color-inProgress)" },
      { status: "On Hold", tickets: counts["On Hold"], fill: "var(--color-onHold)" },
      { status: "Solved", tickets: counts["Solved"], fill: "var(--color-solved)" },
    ]
  }, [tickets])

  const priorityData = useMemo(() => {
    const counts = { "High": 0, "Medium": 0, "Low": 0 }
    tickets.forEach(t => {
      if (counts[t.priority as keyof typeof counts] !== undefined) {
        counts[t.priority as keyof typeof counts]++
      }
    })
    return [
      { priority: "High", tickets: counts["High"], fill: priorityConfig.high.color },
      { priority: "Medium", tickets: counts["Medium"], fill: priorityConfig.medium.color },
      { priority: "Low", tickets: counts["Low"], fill: priorityConfig.low.color },
    ]
  }, [tickets])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      <Card>
        <CardHeader>
          <CardTitle>Tickets by Status</CardTitle>
          <CardDescription>Current distribution of tickets across the workflow.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={statusConfig} className="min-h-[250px] w-full">
            <BarChart accessibilityLayer data={statusData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="status" tickLine={false} tickMargin={10} axisLine={false} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Bar dataKey="tickets" radius={8} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tickets by Priority</CardTitle>
          <CardDescription>Distribution of active tickets by severity.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={priorityConfig} className="min-h-[250px] w-full">
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <Pie
                data={priorityData}
                dataKey="tickets"
                nameKey="priority"
                innerRadius={60}
                strokeWidth={5}
                paddingAngle={2}
              >
                {priorityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <ChartLegend content={<ChartLegendContent />} />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
