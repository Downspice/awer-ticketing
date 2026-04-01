import Link from "next/link"
import { Button } from "@/components/ui/button"
import TicketBoard from "@/components/ticket-board"

export default function TicketsPage() {
  return (
    <div className="container mx-auto flex flex-col">
      <div className="flex justify-between items-center mb-8 shrink-0">
        <h1 className="text-2xl font-bold">Ticket Board</h1>
        <Link href="/create-ticket">
          <Button>Create New Ticket</Button>
        </Link>
      </div>
      <div className="flex-1 min-h-0">
        <TicketBoard />
      </div>
    </div>
  )
}
