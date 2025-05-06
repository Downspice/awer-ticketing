"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "../lib/prisma";
import type {
  CreateTicketData,
  CreateUserData,
  UpdateUserData,
  TicketStatus,
  CreateProjectData,
  UpdateProjectData,
} from "../lib/types";

export async function createTicket(data: CreateTicketData) {
  try {
    // Get the highest ticket number to generate the next one
    const highestTicket = await prisma.ticket.findFirst({
      orderBy: {
        ticketNumber: "desc",
      },
    });

    const nextTicketNumber = highestTicket
      ? highestTicket.ticketNumber + 1
      : 1001;

    // Create the new ticket
    await prisma.ticket.create({
      data: {
        ticketNumber: nextTicketNumber,
        name: data.name,
        priority: data.priority,
        assignedToId: data.assignedToId,
        projectId: data.project,
        assignedToName: data.assignedToName,
        description: data.description,
        status: "Not Started",
      },
    });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to create ticket:", error);
    throw new Error("Failed to create ticket");
  }
}

export async function updateTicketStatus(
  ticketId: number,
  status: TicketStatus,
  additionalData?: { cause?: string; solution?: string; holdReason?: string }
) {
  try {
    await prisma.ticket.update({
      where: { id: ticketId },
      data: {
        status,
        ...(additionalData?.cause && { cause: additionalData.cause }),
        ...(additionalData?.solution && { solution: additionalData.solution }),
        ...(additionalData?.holdReason && {
          holdReason: additionalData.holdReason,
        }),
      },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to update ticket status:", error);
    throw new Error("Failed to update ticket status");
  }
}

export async function updateTicketAssignee(
  ticketId: number,
  assignedToId: string,
  assignedToName: string
) {
  try {
    await prisma.ticket.update({
      where: { id: ticketId },
      data: {
        assignedToId,
        assignedToName,
      },
    });
    revalidatePath("/");
    revalidatePath(`/tickets/${ticketId}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to update ticket assignee:", error);
    throw new Error("Failed to update ticket assignee");
  }
}

export async function createUser(data: CreateUserData) {
  console.log("create USER data ==>", data);
  try {
    await prisma.user.create({
      data: {
        fullName: data.fullName,
        email: data.email,
        roles: data.roles,
        enabled: true,
      },
    });

    revalidatePath("/users");
    return { success: true };
  } catch (error) {
    console.error("Failed to create user:", error);
    console.error("Failed to create user data:", data);
    throw new Error("Failed to create user");
  }
}

export async function updateUser(userId: string, data: UpdateUserData) {
  try {
    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: {
          fullName: data.fullName,
          email: data.email,
          roles: data.roles,
          enabled: data.enabled,
        },
      }),
      prisma.ticket.updateMany({
        where: { assignedToId: userId },
        data: { assignedToName: data.fullName },
      }),
    ]);
    revalidatePath("/users");
    return { success: true };
  } catch (error) {
    console.error("Failed to update user:", error);
    throw new Error("Failed to update user");
  }
}

export async function toggleUserStatus(userId: string, enabled: boolean) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        enabled,
      },
    });

    revalidatePath("/users");
    return { success: true };
  } catch (error) {
    console.error("Failed to toggle user status:", error);
    throw new Error("Failed to toggle user status");
  }
}

//PROJECTS
export async function createProject(data: CreateProjectData) {
  console.log("create Projects ==> ", data);
  try {
    await prisma.projects.create({
      data: {
        name: data.name,
        description: data.description,
        enabled: data.enabled,
      },
    });
    revalidatePath("/projects");
    return { success: true };
  } catch (e) {
    console.log("this error occurred", e);
  }
}

export async function toggleProjectStatus(projectId: string, enabled: boolean) {
  try {
    await prisma.projects.update({
      where: { id: projectId },
      data: {
        enabled,
      },
    });

    revalidatePath("/projects");
    return { success: true };
  } catch (error) {
    console.error("Failed to toggle user status:", error);
    throw new Error("Failed to toggle user status");
  }
}

export async function updateProject(projectId: string, data: UpdateProjectData) {
  try {
    await prisma.$transaction([
      prisma.projects.update({
        where: { id: projectId },
        data: {
          name: data.name,
          description: data.description, 
          enabled: data.enabled,
        },
      }),
    ]);
    revalidatePath("/projects");
    return { success: true };
  } catch (error) {
    console.error("Failed to update project:", error);
    throw new Error("Failed to update project");
  }
}