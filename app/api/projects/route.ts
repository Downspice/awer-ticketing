import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const projects = await prisma.projects.findMany({
      orderBy: {
        name: "asc",
      },
    });
    return NextResponse.json(projects);
  } catch (e) {
    console.log("An error", e);
  }
}

export async function POST(req: Request) {
    try {
      const data = await req.json();
      const project = await prisma.projects.create({
        data,
      });
      return NextResponse.json(project);
    } catch (e) {
      console.log("An error", e);
      return NextResponse.json({ error: "Failed to create" }, { status: 500 });
    }
  }