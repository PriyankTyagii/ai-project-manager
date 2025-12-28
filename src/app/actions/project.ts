"use server";

import { prisma } from "@/lib/prisma";
import { inngest } from "@/lib/inngest/client";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth/session";

async function requireAuth() {
  const session = await getSession();
  if (!session || !session.email) throw new Error("Not authenticated");
  return session;
}

export async function createProject(formData: FormData) {
  try {
    const session = await requireAuth(); // ✅ ensure we have a logged-in user

    const name = formData.get("name") as string;
    const goal = formData.get("goal") as string;

    if (!name || !goal) throw new Error("Name and goal are required");

    const project = await prisma.project.create({
      data: {
        name,
        goal,
        description: "",
        user: { connect: { email: session.email } } // ⚡ connect via unique field
      }
    });

    await inngest.send({
      name: "project.created",
      data: { projectId: project.id, name: project.name, goal: project.goal }
    });

    revalidatePath("/dashboard");
    return project;
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
}

export async function getProject(projectId: string) {
  try {
    return await prisma.project.findUnique({
      where: { id: projectId },
      include: { tasks: { include: { agentComments: true }, orderBy: { createdAt: "desc" } } }
    });
  } catch (error) {
    console.error("Error fetching project:", error);
    throw error;
  }
}

export async function updateTaskStatus(taskId: string, status: string) {
  try {
    const task = await prisma.task.findUnique({ where: { id: taskId }, include: { project: true } });
    if (!task) throw new Error("Task not found");

    const updated = await prisma.task.update({
      where: { id: taskId },
      data: {
        status,
        lastUpdatedAt: new Date(),
        ...(status === "done" && { completedAt: new Date() }),
        ...(status === "in_progress" && !task.startedAt && { startedAt: new Date() })
      }
    });

    await inngest.send({ name: "task.updated", data: { taskId: updated.id, projectId: updated.projectId, status } });
    revalidatePath(`/project/${updated.projectId}`);
    return updated;
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
}

export async function getAllProjects() {
  try {
    const session = await requireAuth();
    return await prisma.project.findMany({
      where: { status: "active", user: { email: session.email } },
      include: { tasks: true },
      orderBy: { createdAt: "desc" }
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
}
