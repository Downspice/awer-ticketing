"use client"

import React, { useState, useEffect } from "react"
import { DashboardMetrics } from "@/components/dashboard-metrics"
import { Skeleton } from "@/components/ui/skeleton"
import { DashboardCharts } from "@/components/dashboard-charts"
import { RecentUpdates } from "@/components/recent-updates"
import type { Ticket } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, RefreshCw } from "lucide-react"

export default function DashboardPage() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const refreshData = async () => {
    try {
      setIsRefreshing(true)
      const response = await fetch("/api/tickets")
      const data = await response.json()
      setTickets(data)
    } catch (error) {
      console.error("Failed to refresh dashboard data:", error)
    } finally {
      setLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    refreshData()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center pb-4 border-b border-border/40">
          <div className="space-y-2">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-72" />
          </div>
          <Skeleton className="h-9 w-28" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-[360px] w-full rounded-xl" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-border/40">
        <div>
          <div className="flex items-center gap-2">
            <LayoutDashboard className="h-5 w-5 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Dashboard Overview
            </h1>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Real-time analytics, resolution metrics, and system activity across all tickets.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={refreshData}
          disabled={isRefreshing}
          className="gap-2 border-border/70 bg-card/60 hover:bg-accent/40 w-fit"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </Button>
      </div>

      <DashboardMetrics tickets={tickets} />

      <DashboardCharts tickets={tickets} />

      <RecentUpdates tickets={tickets} />
    </div>
  )
}
