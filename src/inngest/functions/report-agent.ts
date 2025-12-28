import { inngest } from "@/lib/inngest/client";
import { prisma } from "@/lib/prisma";
import { startOfDay, endOfDay } from "date-fns";

export const reportAgent = inngest.createFunction(
  { 
    id: "daily-report-agent",
    name: "Daily Report Generator"
  },
  { cron: "0 20 * * *" },
  async ({ step }) => {
    const projects = await step.run("fetch-projects", async () => {
      return await prisma.project.findMany({
        where: { status: "active" },
        include: {
          tasks: {
            include: { agentComments: true }
          }
        }
      });
    });

    for (const project of projects) {
      const report = await step.run(`generate-report-${project.id}`, async () => {
        const today = new Date();
        const completedToday = project.tasks.filter(
  t => t.completedAt && 
       new Date(t.completedAt) >= startOfDay(today) &&
       new Date(t.completedAt) <= endOfDay(today)
);

        const inProgress = project.tasks.filter(t => t.status === "in_progress");
        const blocked = project.tasks.filter(t => t.status === "blocked");
        const done = project.tasks.filter(t => t.status === "done");
        
        const totalTasks = project.tasks.length;
        const velocity = totalTasks > 0 
          ? Math.round((done.length / totalTasks) * 100) 
          : 0;

        const insights = [
          completedToday.length > 0 ? `🎉 Completed ${completedToday.length} task(s) today!` : "📝 No tasks completed today yet",
          inProgress.length > 0 ? `⚡ ${inProgress.length} task(s) in progress` : "💡 Ready to start new tasks",
          blocked.length > 0 ? `⚠️ ${blocked.length} task(s) blocked - needs attention` : "✅ No blockers",
          `💪 Overall progress: ${velocity}% complete`
        ];

        const nextPriorities = project.tasks
          .filter(t => t.status !== "done")
          .sort((a, b) => {
            const priorityOrder = { high: 0, medium: 1, low: 2 };
            return priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder];
          })
          .slice(0, 3)
          .map(t => t.title);

        return {
          date: today.toISOString(),
          metrics: {
            completed: completedToday.length,
            inProgress: inProgress.length,
            blocked: blocked.length,
            velocity: `${velocity}%`
          },
          insights,
          nextPriorities
        };
      });

      await step.run(`save-report-${project.id}`, async () => {
        await prisma.event.create({
          data: {
            projectId: project.id,
            name: "report.daily",
            payload: report
          }
        });
      });
    }

    return { projectsReported: projects.length };
  }
);