"use client";

import { useState } from "react"
import { Button } from "@/components/ui/button"
import TicketBoard from "@/components/ticket-board"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { TicketCreateForm } from "@/components/ticket-create-form"
import { useRouter } from "next/navigation"
import { Plus, Ticket } from "lucide-react"

export default function TicketsPage() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const handleSuccess = () => {
    setOpen(false)
    router.refresh()
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-border/40">
        <div>
          <div className="flex items-center gap-2">
            <Ticket className="h-5 w-5 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Support Ticket Board
            </h1>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Drag and drop tickets between columns to update their resolution status in real time.
          </p>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button className="gap-2 shadow-xs bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="h-4 w-4" />
              <span>Create New Ticket</span>
            </Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-[540px] overflow-y-auto">
            <SheetHeader className="mb-6">
              <SheetTitle>Create New Ticket</SheetTitle>
              <SheetDescription>
                Fill in the details below to log a new ticket into the system.
              </SheetDescription>
            </SheetHeader>
            <TicketCreateForm
              onSuccess={handleSuccess}
              onCancel={() => setOpen(false)}
            />
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Board View */}
      <div className="flex-1 min-h-0">
        <TicketBoard />
      </div>
    </div>
  )
}
