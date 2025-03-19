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

export async function POST() {
    try {
      const projects = await prisma.projects.create({
        orderBy: {
          name: "asc",
        },
      });
      return NextResponse.json(projects);
    } catch (e) {
      console.log("An error", e);
    }
  }