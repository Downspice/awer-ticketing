"use client"

import React, { useState, useEffect } from "react"
import { DashboardMetrics } from "@/components/dashboard-metrics"
import { Skeleton } from "@/components/ui/skeleton"
import { DashboardCharts } from "@/components/dashboard-charts"
import { RecentUpdates } from "@/components/recent-updates"
import type { Ticket } from "@/lib/types"

export default function DashboardPage() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    refreshData()
  }, [])

  const refreshData = async () => {
    try {
      const response = await fetch("/api/tickets")
      const data = await response.json()
      setTickets(data)
    } catch (error) {
      console.error("Failed to refresh dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto space-y-8">
        <div>
          <Skeleton className="h-10 w-[250px] mb-2" />
          <Skeleton className="h-4 w-[400px]" />
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-[120px] w-full rounded-xl" />
          <Skeleton className="h-[120px] w-full rounded-xl" />
          <Skeleton className="h-[120px] w-full rounded-xl" />
          <Skeleton className="h-[120px] w-full rounded-xl" />
        </div>
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>
    )
  }

  return (
    <div className="container mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-2">
          Real-time metrics, analytics, and activity across your entire ticketing platform.
        </p>
      </div>

      <div className="mt-8">
         <DashboardMetrics tickets={tickets} />
      </div>

      <DashboardCharts tickets={tickets} />

      <RecentUpdates tickets={tickets} />
    </div>
  )
}
