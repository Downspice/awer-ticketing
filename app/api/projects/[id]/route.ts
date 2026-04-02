import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const uniqueProject = await prisma.projects.findUnique({
      where: {
        id: params.id,
      },
    });
    if (!uniqueProject) {
      return NextResponse.json(
        { error: "Project does not exist not found"},
        { status: 404 }
      );
    }

    return NextResponse.json(uniqueProject);
  } catch (e) {
    console.error("Failed to fetch ticket:", e);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

