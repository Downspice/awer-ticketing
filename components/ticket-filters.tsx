import React from "react"
import { Search, SlidersHorizontal, X } from "lucide-react"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
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
      assignedToId: "all",
    })
  }

  const activeFilterCount =
    (filters.priority !== "all" ? 1 : 0) +
    (filters.projectId !== "all" ? 1 : 0) +
    (filters.assignedToId !== "all" ? 1 : 0) +
    (filters.search ? 1 : 0)

  return (
    <div className="flex flex-col gap-3 mb-6">
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tickets by name or #..."
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            className="pl-9 pr-9 w-full bg-card/60 border-border/80 focus-visible:ring-primary/30"
          />
          {filters.search && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground hover:text-foreground"
              onClick={() => updateFilter("search", "")}
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Filter Dropdown & Quick Clear */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="gap-2 border-border/80 bg-card/60 hover:bg-accent/40 w-full sm:w-auto"
              >
                <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
                <span>Filters</span>
                {activeFilterCount > 0 && (
                  <Badge
                    variant="default"
                    className="h-5 px-1.5 text-[10px] rounded-full bg-primary text-primary-foreground"
                  >
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[300px] p-3 space-y-3">
              <DropdownMenuLabel className="flex justify-between items-center p-0 text-xs font-semibold">
                Filter Tickets
                {activeFilterCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
                  >
                    Clear All
                  </Button>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Priority</label>
                  <Select
                    value={filters.priority}
                    onValueChange={(val) => updateFilter("priority", val)}
                  >
                    <SelectTrigger className="h-9">
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
                  <Select
                    value={filters.projectId}
                    onValueChange={(val) => updateFilter("projectId", val)}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="All Projects" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Projects</SelectItem>
                      {projects.map((proj) => (
                        <SelectItem key={proj.id} value={proj.id}>
                          {proj.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Assignee</label>
                  <Select
                    value={filters.assignedToId}
                    onValueChange={(val) => updateFilter("assignedToId", val)}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="All Technicians" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Technicians</SelectItem>
                      <SelectItem value="unassigned">Unassigned</SelectItem>
                      {users.map((u) => (
                        <SelectItem key={u.id} value={u.id}>
                          {u.fullName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-xs text-muted-foreground hover:text-foreground h-9"
            >
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Quick Filter Badges */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <span className="text-muted-foreground text-[11px] font-medium mr-1 shrink-0">Quick filters:</span>
        <button
          type="button"
          onClick={() => updateFilter("priority", filters.priority === "High" ? "all" : "High")}
          className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
            filters.priority === "High"
              ? "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/40"
              : "bg-card/60 text-muted-foreground border-border/80 hover:bg-accent/40"
          }`}
        >
          High Priority
        </button>
        <button
          type="button"
          onClick={() =>
            updateFilter("assignedToId", filters.assignedToId === "unassigned" ? "all" : "unassigned")
          }
          className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
            filters.assignedToId === "unassigned"
              ? "bg-primary/15 text-primary border-primary/40"
              : "bg-card/60 text-muted-foreground border-border/80 hover:bg-accent/40"
          }`}
        >
          Unassigned
        </button>
      </div>
    </div>
  )
}
