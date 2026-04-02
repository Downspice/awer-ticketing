import React from "react"
import { Search, SlidersHorizontal, X } from "lucide-react"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import type { Projects, User } from "@prisma/client"

export interface TicketFilterState {
  search: string
  priority: string
  projectId: string
  assignedToId: string
}

interface TicketFiltersProps {
  filters: TicketFilterState
  onFilterChange: (filters: TicketFilterState) => void
  projects: Projects[]
  users: User[]
}

export function TicketFilters({ filters, onFilterChange, projects, users }: TicketFiltersProps) {
  const updateFilter = (key: keyof TicketFilterState, value: string) => {
    onFilterChange({ ...filters, [key]: value })
  }

  const clearFilters = () => {
    onFilterChange({
      search: "",
      priority: "all",
      projectId: "all",
      assignedToId: "all"
    })
  }

  const hasActiveFilters = filters.priority !== "all" || filters.projectId !== "all" || filters.assignedToId !== "all"

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
      <div className="relative flex-1 w-full relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search tickets by name or #"
          value={filters.search}
          onChange={(e) => updateFilter("search", e.target.value)}
          className="pl-9 w-full bg-background border-primary/20 hover:border-primary/50 transition-colors"
        />
        {filters.search && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground hover:text-foreground"
            onClick={() => updateFilter("search", "")}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="border-primary/20 flex gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              <span className="hidden sm:inline">Filters</span>
              {hasActiveFilters && (
                <span className="h-2 w-2 rounded-full bg-primary" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[280px]">
            <DropdownMenuLabel className="flex justify-between items-center">
              Filter Options
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="h-6 px-2 text-xs">
                  Clear All
                </Button>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            <div className="p-2 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Priority</label>
                <Select value={filters.priority} onValueChange={(val) => updateFilter("priority", val)}>
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="All Priorities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Project</label>
                <Select value={filters.projectId} onValueChange={(val) => updateFilter("projectId", val)}>
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="All Projects" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Projects</SelectItem>
                    {projects.map(p => (
                      <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Assignee</label>
                <Select value={filters.assignedToId} onValueChange={(val) => updateFilter("assignedToId", val)}>
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="All Assignees" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Assignees</SelectItem>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                    {users?.map(u => (
                      <SelectItem key={u.id} value={u.id}>{u.fullName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
