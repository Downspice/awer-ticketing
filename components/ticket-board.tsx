"use client"

import { useState, useEffect, useMemo } from "react"
import { DragDropContext, type DropResult } from "@hello-pangea/dnd"
import StatusColumn from "../components/status-column"
import SolvedModal from "../components/solved-modal"
import OnHoldModal from "../components/on-hold-modal"
import type { Ticket, TicketStatus } from "../lib/types"
import { updateTicketStatus } from "../lib/actions"
import type { Projects, User } from "@prisma/client"
import { TicketFilters, type TicketFilterState } from "./ticket-filters"
import { TicketDetailSheet } from "./ticket-detail-sheet"

export default function TicketBoard() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [projects, setProjects] = useState<Projects[]>([])
  const [users, setUsers] = useState<User[]>([])
  
  const [loading, setLoading] = useState(true)
  const [currentTicket, setCurrentTicket] = useState<Ticket | null>(null)
  const [showSolvedModal, setShowSolvedModal] = useState(false)
  const [showOnHoldModal, setShowOnHoldModal] = useState(false)
  
  const [detailTicket, setDetailTicket] = useState<Ticket | null>(null)
  
  const [filters, setFilters] = useState<TicketFilterState>({
    search: "",
    priority: "all",
    projectId: "all",
    assignedToId: "all"
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ticketsRes, projectsRes, usersRes] = await Promise.all([
          fetch("/api/tickets"),
          fetch("/api/projects"),
          fetch("/api/users?role=technician")
        ])
        
        const ticketsData = await ticketsRes.json()
        const projectsData = await projectsRes.json()
        const usersData = await usersRes.json()
        
        setTickets(ticketsData)
        setProjects(projectsData)
        setUsers(usersData)
      } catch (error) {
        console.error("Failed to fetch data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredTickets = useMemo(() => {
    return tickets.filter(t => {
      const matchSearch = String(t.ticketNumber).includes(filters.search) || 
                          t.name.toLowerCase().includes(filters.search.toLowerCase())
      const matchPriority = filters.priority === "all" || t.priority === filters.priority
      const matchProject = filters.projectId === "all" || t.projectId === filters.projectId
      
      let matchAssignee = true;
      if (filters.assignedToId === "unassigned") {
        matchAssignee = !t.assignedToId;
      } else if (filters.assignedToId !== "all") {
        matchAssignee = t.assignedToId === filters.assignedToId;
      }

      return matchSearch && matchPriority && matchProject && matchAssignee;
    })
  }, [tickets, filters])

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result

    if (!destination) return
    if (destination.droppableId === source.droppableId && destination.index === source.index) return

    const ticket = tickets.find((t) => t.id.toString() === draggableId)
    if (!ticket) return

    const newStatus = destination.droppableId as TicketStatus

    if (newStatus === "Solved" && ticket.status !== "Solved") {
      setCurrentTicket(ticket)
      setShowSolvedModal(true)
      return
    }

    if (newStatus === "On Hold" && ticket.status !== "On Hold") {
      setCurrentTicket(ticket)
      setShowOnHoldModal(true)
      return
    }

    await updateTicketStatusAndRefresh(ticket.id, newStatus)
  }

  const updateTicketStatusAndRefresh = async (
    ticketId: number,
    status: TicketStatus,
    additionalData?: { cause?: string; solution?: string; holdReason?: string },
  ) => {
    // Optimistic UI update could go here
    try {
      await updateTicketStatus(ticketId, status, additionalData)
      const response = await fetch("/api/tickets")
      const data = await response.json()
      setTickets(data)
    } catch (error) {
      console.error("Failed to update ticket status:", error)
    }
  }

  const handleSolvedSubmit = async (cause: string, solution: string) => {
    if (!currentTicket) return
    await updateTicketStatusAndRefresh(currentTicket.id, "Solved", { cause, solution })
    setShowSolvedModal(false)
    setCurrentTicket(null)
  }

  const handleOnHoldSubmit = async (holdReason: string) => {
    if (!currentTicket) return
    await updateTicketStatusAndRefresh(currentTicket.id, "On Hold", { holdReason })
    setShowOnHoldModal(false)
    setCurrentTicket(null)
  }

  const handleModalClose = () => {
    setShowSolvedModal(false)
    setShowOnHoldModal(false)
    setCurrentTicket(null)
  }

  const handleTicketClick = (ticket: Ticket) => {
    setDetailTicket(ticket)
  }

  const refreshTickets = async () => {
    try {
      const response = await fetch("/api/tickets")
      const data = await response.json()
      setTickets(data)
    } catch (error) {
      console.error("Failed to refresh tickets:", error)
    }
  }

  if (loading) {
    return <div className="flex justify-center p-8 text-muted-foreground animate-pulse">Loading tickets and data...</div>
  }

  const getTicketsByStatus = (status: TicketStatus) => {
    return filteredTickets.filter((ticket) => ticket.status === status)
  }

  return (
    <div className="flex flex-col w-full h-full">
      <TicketFilters 
        filters={filters} 
        onFilterChange={setFilters} 
        projects={projects} 
        users={users} 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DragDropContext onDragEnd={handleDragEnd}>
          <StatusColumn title="Not Started" tickets={getTicketsByStatus("Not Started")} status="Not Started" onTicketClick={handleTicketClick} />
          <StatusColumn title="In Progress" tickets={getTicketsByStatus("In Progress")} status="In Progress" onTicketClick={handleTicketClick} />
          <StatusColumn title="On Hold" tickets={getTicketsByStatus("On Hold")} status="On Hold" onTicketClick={handleTicketClick} />
          <StatusColumn title="Solved" tickets={getTicketsByStatus("Solved")} status="Solved" onTicketClick={handleTicketClick} />
        </DragDropContext>
      </div>

      {showSolvedModal && currentTicket && (
        <SolvedModal ticket={currentTicket} onSubmit={handleSolvedSubmit} onClose={handleModalClose} />
      )}

      {showOnHoldModal && currentTicket && (
        <OnHoldModal ticket={currentTicket} onSubmit={handleOnHoldSubmit} onClose={handleModalClose} />
      )}

      <TicketDetailSheet
        ticket={detailTicket}
        open={!!detailTicket}
        onClose={() => setDetailTicket(null)}
        onUpdated={refreshTickets}
        projects={projects}
        users={users}
      />
    </div>
  )
}

