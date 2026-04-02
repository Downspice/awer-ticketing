import React, { useState, useEffect } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "./ui/sheet"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Textarea } from "./ui/textarea"
import { Label } from "./ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { updateTicketDetails } from "../lib/actions"
import type { Projects, User } from "@prisma/client"
import type { Ticket } from "../lib/types"
import { Clock, User as UserIcon, Hash, CheckSquare, Pencil } from "lucide-react"

interface TicketDetailSheetProps {
  ticket: Ticket | null
  open: boolean
  onClose: () => void
  onUpdated: () => void
  projects: Projects[]
  users: User[]
}

export function TicketDetailSheet({ ticket, open, onClose, onUpdated, projects, users }: TicketDetailSheetProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [editData, setEditData] = useState({
    priority: "",
    projectId: "",
    assignedToId: "unassigned",
    description: ""
  })

  // Reset form when ticket changes
  useEffect(() => {
    if (ticket) {
      setEditData({
        priority: ticket.priority,
        projectId: ticket.projectId,
        assignedToId: ticket.assignedToId || "unassigned",
        description: ticket.description
      })
      setIsEditing(false)
    }
  }, [ticket])

  if (!ticket) return null

  const handleSave = async () => {
    setIsSubmitting(true)
    try {
      const assignedUser = users.find(u => u.id === editData.assignedToId)
      
      await updateTicketDetails(ticket.id, {
        priority: editData.priority,
        projectId: editData.projectId,
        assignedToId: editData.assignedToId === "unassigned" ? null : editData.assignedToId,
        assignedToName: assignedUser ? assignedUser.fullName : null,
        description: editData.description
      })
      
      setIsEditing(false)
      onUpdated()
    } catch (e) {
      console.error(e)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "var(--color-destructive, #ef4444)"
      case "Medium": return "#eab308"
      case "Low": return "var(--color-primary, #3b82f6)"
      default: return "transparent"
    }
  }

  const project = projects.find(p => p.id === ticket.projectId)

  return (
    <Sheet open={open} onOpenChange={(val) => !val && onClose()}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto p-6 sm:p-8 bg-background/95 backdrop-blur-md border-l border-primary/20">
        <SheetHeader className="mb-6">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2 text-xl">
              <Hash className="h-5 w-5 text-muted-foreground" />
              {ticket.ticketNumber}
            </SheetTitle>
            {!isEditing && (
              <Button variant="outline" size="icon" onClick={() => setIsEditing(true)}>
                <Pencil className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Button>
            )}
            {isEditing && (
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>Cancel</Button>
                <Button size="sm" onClick={handleSave} disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save"}
                </Button>
              </div>
            )}
          </div>
          <SheetDescription className="text-lg font-medium text-foreground mt-2">
            {ticket.name}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6">
          <div className="flex flex-wrap gap-4 p-4 rounded-lg bg-card/50 border border-primary/10">
            <div className="flex-1 min-w-[120px]">
              <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                <CheckSquare className="h-3 w-3" /> Status
              </div>
              <div className="font-medium text-sm">{ticket.status}</div>
            </div>
            <div className="flex-1 min-w-[120px]">
              <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                <UserIcon className="h-3 w-3" /> Assignee
              </div>
              {!isEditing ? (
                 <div className="font-medium text-sm truncate">{ticket.assignedToName || "Unassigned"}</div>
              ) : (
                <Select value={editData.assignedToId} onValueChange={v => setEditData({...editData, assignedToId: v})}>
                  <SelectTrigger className="h-8 shadow-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                    {users?.map(u => (
                      <SelectItem key={u.id} value={u.id}>{u.fullName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Priority</Label>
              {!isEditing ? (
                <div>
                   <Badge style={{ backgroundColor: getPriorityColor(ticket.priority), color: '#fff' }} className="mt-1">
                     {ticket.priority}
                   </Badge>
                </div>
              ) : (
                <Select value={editData.priority} onValueChange={v => setEditData({...editData, priority: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
            
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Project</Label>
              {!isEditing ? (
                <div className="text-sm font-medium mt-1">{project?.name || "Unknown"}</div>
              ) : (
                <Select value={editData.projectId} onValueChange={v => setEditData({...editData, projectId: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map(p => (
                      <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm">Description</Label>
            {!isEditing ? (
              <div className="text-sm whitespace-pre-wrap text-muted-foreground bg-muted/30 p-4 rounded-md border border-border">
                {ticket.description || "No description provided."}
              </div>
            ) : (
              <Textarea 
                value={editData.description} 
                onChange={e => setEditData({...editData, description: e.target.value})}
                className="min-h-[150px] resize-y"
              />
            )}
          </div>

          {ticket.status === "Solved" && ticket.cause && (
            <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2">
              <Label className="text-sm text-emerald-500">Cause & Solution</Label>
              <div className="text-sm whitespace-pre-wrap text-muted-foreground bg-emerald-500/10 p-4 rounded-md border border-emerald-500/20">
                <strong>Cause:</strong> {ticket.cause}
                <br /><br />
                <strong>Solution:</strong> {ticket.solution}
              </div>
            </div>
          )}

          {ticket.status === "On Hold" && ticket.holdReason && (
            <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2">
              <Label className="text-sm text-[var(--on-hold)]">Hold Reason</Label>
              <div className="text-sm whitespace-pre-wrap text-muted-foreground bg-[var(--on-hold)]/10 p-4 rounded-md border border-[var(--on-hold)]/20">
                {ticket.holdReason}
              </div>
            </div>
          )}

          <div className="flex items-center text-xs text-muted-foreground pt-4 border-t border-border mt-8">
            <Clock className="h-3 w-3 mr-1" />
            Created {new Date(ticket.createdAt).toLocaleString()}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
