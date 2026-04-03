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

export default function TicketsPage() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const handleSuccess = () => {
    setOpen(false)
    router.refresh()
  }

  return (
    <div className="container mx-auto flex flex-col">
      <div className="flex justify-between items-center mb-8 shrink-0">
        <h1 className="text-2xl font-bold">Ticket Board</h1>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button>Create New Ticket</Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-[540px]">
            <SheetHeader className="mb-6">
              <SheetTitle>Create New Ticket</SheetTitle>
              <SheetDescription>
                Fill in the details below to create a new support ticket.
              </SheetDescription>
            </SheetHeader>
            <TicketCreateForm 
              onSuccess={handleSuccess} 
              onCancel={() => setOpen(false)} 
            />
          </SheetContent>
        </Sheet>
      </div>
      <div className="flex-1 min-h-0">
        <TicketBoard />
      </div>
    </div>
  )
}
