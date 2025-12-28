import { inngest } from "@/lib/inngest/client";
import { prisma } from "@/lib/prisma";
import { differenceInHours } from "date-fns";

export const riskAgent = inngest.createFunction(
  { 
    id: "risk-agent",
    name: "Risk Detection Agent"
  },
  { event: "task.updated" },
  async ({ event, step }) => {
    const { taskId } = event.data;

    const task = await step.run("fetch-task", async () => {
      return await prisma.task.findUnique({
        where: { id: taskId },
        include: { agentComments: true }
      });
    });

    if (!task) return { skipped: true };

    const risks = await step.run("detect-risks", async () => {
      const detectedRisks = [];
      
      if (task.status === "in_progress") {
        const hoursSinceUpdate = differenceInHours(new Date(), task.lastUpdatedAt);
        if (hoursSinceUpdate > 24) {
          detectedRisks.push({
            type: "stalled",
            message: "⚠️ No progress in 24 hours. Need help?"
          });
        }
      }

      if (task.dependencies.length > 0) {
        const dependencies = await prisma.task.findMany({
          where: { id: { in: task.dependencies } }
        });
        
        const incompleteDeps = dependencies.filter(d => d.status !== "done");
        if (incompleteDeps.length > 0 && task.status === "in_progress") {
          detectedRisks.push({
            type: "blocked",
            message: `🔗 Blocked: ${incompleteDeps.length} dependencies not complete`
          });
        }
      }

      if (task.priority === "high" && task.status === "backlog") {
        const daysSinceCreation = differenceInHours(new Date(), task.createdAt) / 24;
        if (daysSinceCreation > 2) {
          detectedRisks.push({
            type: "delayed_start",
            message: "🚨 High priority task not started after 2 days"
          });
        }
      }

      return detectedRisks;
    });

    if (risks.length > 0) {
      await step.run("handle-risks", async () => {
        for (const risk of risks) {
          await prisma.agentComment.create({
            data: {
              taskId: task.id,
              agent: "Risk Agent",
              message: risk.message,
              type: "warning"
            }
          });

          if (risk.type === "blocked") {
            await prisma.task.update({
              where: { id: task.id },
              data: { status: "blocked" }
            });
          }
        }
      });
    }

    return { risksDetected: risks.length };
  }
);