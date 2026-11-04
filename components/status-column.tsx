"use client"

import * as React from "react"
import { Droppable, Draggable } from "@hello-pangea/dnd"
import TicketCard from "../components/ticket-card"
import type { Ticket, TicketStatus } from "../lib/types"
import { Badge } from "@/components/ui/badge"
import { CircleDot, Inbox } from "lucide-react"

interface StatusColumnProps {
  title: string
  tickets: Ticket[]
  status: TicketStatus
  onTicketClick: (ticket: Ticket) => void
}

export default function StatusColumn({ title, tickets, status, onTicketClick }: StatusColumnProps) {
  const getStatusConfig = (status: TicketStatus) => {
    switch (status) {
      case "Not Started":
        return {
          dotColor: "bg-slate-400 dark:bg-slate-500",
          topBorder: "border-t-slate-400 dark:border-t-slate-500",
          accentColor: "text-slate-500 dark:text-slate-400",
        }
      case "In Progress":
        return {
          dotColor: "bg-amber-500",
          topBorder: "border-t-amber-500",
          accentColor: "text-amber-500",
        }
      case "On Hold":
        return {
          dotColor: "bg-purple-500",
          topBorder: "border-t-purple-500",
          accentColor: "text-purple-500",
        }
      case "Solved":
        return {
          dotColor: "bg-emerald-500",
          topBorder: "border-t-emerald-500",
          accentColor: "text-emerald-500",
        }
      default:
        return {
          dotColor: "bg-primary",
          topBorder: "border-t-primary",
          accentColor: "text-primary",
        }
    }
  }

  const config = getStatusConfig(status)

  return (
    <div
      className={`rounded-xl border border-border/70 border-t-4 ${config.topBorder} bg-card/60 backdrop-blur-xs p-3.5 flex flex-col min-h-[500px] shadow-xs transition-colors`}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${config.dotColor}`} />
          <h2 className="text-sm font-semibold tracking-tight text-foreground">{title}</h2>
        </div>
        <Badge
          variant="secondary"
          className="h-5 px-1.5 text-[11px] font-semibold rounded-full bg-muted/80 text-muted-foreground border border-border/40"
        >
          {tickets.length}
        </Badge>
      </div>

      {/* Droppable Drop Zone */}
      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 rounded-lg p-1.5 transition-all duration-200 min-h-[220px] ${
              snapshot.isDraggingOver
                ? "bg-primary/5 ring-2 ring-primary/20 border-2 border-dashed border-primary/40"
                : "bg-muted/20 border border-transparent"
            }`}
          >
            {tickets.length === 0 && !snapshot.isDraggingOver ? (
              <div className="flex flex-col items-center justify-center h-40 text-center p-4 border border-dashed border-border/60 rounded-lg">
                <Inbox className="h-6 w-6 text-muted-foreground/40 mb-1.5" />
                <p className="text-xs font-medium text-muted-foreground/70">No tickets</p>
                <p className="text-[11px] text-muted-foreground/50">Drag tickets here</p>
              </div>
            ) : (
              tickets.map((ticket, index) => (
                <Draggable
                  key={ticket.id.toString()}
                  draggableId={ticket.id.toString()}
                  index={index}
                >
                  {(provided, dragSnapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`mb-2.5 transition-transform ${
                        dragSnapshot.isDragging ? "rotate-1 scale-102 shadow-xl z-50 opacity-95" : ""
                      }`}
                    >
                      <TicketCard ticket={ticket} onClick={onTicketClick} />
                    </div>
                  )}
                </Draggable>
              ))
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  )
}
