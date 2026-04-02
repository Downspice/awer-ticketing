import { NextResponse } from "next/server"
import { prisma } from "../../../../lib/prisma"

export async function GET(_request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const ticket = await prisma.ticket.findUnique({
      where: {
        id: Number.parseInt(params.id),
      },
      include: {
        assignedTo: true,
      },
    })

    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 })
    }

    return NextResponse.json(ticket)
  } catch (error) {
    console.error("Failed to fetch ticket:", error)
    return NextResponse.json({ error: "Failed to fetch ticket" }, { status: 500 })
  }
}

