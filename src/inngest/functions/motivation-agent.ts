import { inngest } from "@/lib/inngest/client";
import { prisma } from "@/lib/prisma";

export const motivationAgent = inngest.createFunction(
  { 
    id: "motivation-agent",
    name: "Motivation Agent"
  },
  { event: "task.at_risk" },
  async ({ event, step }) => {
    const { taskId, riskType } = event.data;

    const task = await step.run("fetch-task", async () => {
      return await prisma.task.findUnique({
        where: { id: taskId }
      });
    });

    if (!task) return { skipped: true };

    const motivationalMessages = {
      stalled: "🚀 Let's get this moving! Even small progress is progress. You've got this!",
      blocked: "🤔 Looks like there's a blocker. Want to tackle the dependencies first?",
      delayed_start: "⚡ This is important! Let's prioritize it today and make some headway.",
      default: "💪 Keep up the great work! You're making solid progress."
    };

    const message = motivationalMessages[riskType as keyof typeof motivationalMessages] || motivationalMessages.default;

    await step.run("add-comment", async () => {
      await prisma.agentComment.create({
        data: {
          taskId: task.id,
          agent: "Motivation Agent",
          message,
          type: "motivation"
        }
      });
    });

    return { success: true };
  }
);

export const dailyMotivation = inngest.createFunction(
  { 
    id: "daily-motivation",
    name: "Daily Motivation"
  },
  { cron: "0 9 * * *" },
  async ({ step }) => {
    const inProgressTasks = await step.run("fetch-active-tasks", async () => {
      return await prisma.task.findMany({
        where: { status: "in_progress" },
        include: { project: true }
      });
    });

    for (const task of inProgressTasks) {
      await step.run(`motivate-${task.id}`, async () => {
        await prisma.agentComment.create({
          data: {
            taskId: task.id,
            agent: "Motivation Agent",
            message: "🌅 Good morning! Ready to make progress on this today?",
            type: "motivation"
          }
        });
      });
    }

    return { tasksMotivated: inProgressTasks.length };
  }
);