import { inngest } from "@/lib/inngest/client";
import { prisma } from "@/lib/prisma";
import OpenAI from "openai";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

interface TaskData {
  title: string;
  description: string;
  priority: string;
  effort: string;
  estimatedDays: number;
  dependencies: string[];
  acceptanceCriteria?: string[];
}

interface EpicData {
  name: string;
  tasks: TaskData[];
}

interface TaskPlanResponse {
  epics: EpicData[];
}

export const plannerAgent = inngest.createFunction(
  { 
    id: "planner-agent",
    name: "Planner Agent"
  },
  { event: "project.created" },
  async ({ event, step }) => {
    const { projectId, goal, name } = event.data;

    const taskPlan = await step.run("generate-task-plan", async () => {
      try {
        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: `You are a Senior Project Manager and Scrum Master with 15+ years of experience. Break down projects into professional, actionable tasks following Agile best practices.

CRITICAL RULES:
1. Create CONCISE, SPECIFIC task titles (max 8 words)
2. Each task should be completable in 1-5 days
3. Use clear action verbs (Implement, Design, Setup, Configure, Test, Deploy)
4. Break large features into smaller user stories
5. Include realistic effort estimates
6. Identify dependencies clearly
7. Set proper priorities (High for MVP critical, Medium for important, Low for nice-to-have)
8. Write clear descriptions with acceptance criteria

OUTPUT FORMAT (JSON only):
{
  "epics": [
    {
      "name": "Epic Name (e.g., User Authentication)",
      "tasks": [
        {
          "title": "Setup authentication infrastructure",
          "description": "Configure auth system with email/password and OAuth providers. Include password reset flow.",
          "priority": "high",
          "effort": "3 days",
          "estimatedDays": 3,
          "dependencies": [],
          "acceptanceCriteria": [
            "Users can register with email",
            "Users can login with OAuth",
            "Password reset works via email"
          ]
        }
      ]
    }
  ]
}

EXAMPLE OF GOOD TASKS:
✅ "Setup PostgreSQL database schema"
✅ "Implement user registration API"
✅ "Design dashboard wireframes"
✅ "Configure CI/CD pipeline"

EXAMPLE OF BAD TASKS:
❌ "Do backend stuff" (too vague)
❌ "Build the entire authentication system from scratch including email verification, password reset, OAuth integration with Google and GitHub, session management, and security features" (too long/complex)
❌ "Make it work" (not specific)

Create 8-15 tasks total, organized into 3-5 epics.`
            },
            {
              role: "user",
              content: `Project: ${name}

Goal: ${goal}

Break this into professional, sprint-ready tasks. Focus on MVP features first.`
            }
          ],
          temperature: 0.7,
          max_tokens: 3000
        });

        const content = completion.choices[0].message.content || "{}";
        return JSON.parse(content) as TaskPlanResponse;
      } catch (error) {
        console.error("OpenAI error:", error);
        // Fallback professional tasks
        return {
          epics: [
            {
              name: "Project Setup & Planning",
              tasks: [
                {
                  title: "Define project requirements",
                  description: "Document functional and technical requirements. Create user stories and acceptance criteria.",
                  priority: "high",
                  effort: "2 days",
                  estimatedDays: 2,
                  dependencies: [],
                  acceptanceCriteria: [
                    "Requirements documented",
                    "User stories created",
                    "Stakeholders approved"
                  ]
                },
                {
                  title: "Setup development environment",
                  description: "Configure local dev environment, version control, and project structure.",
                  priority: "high",
                  effort: "1 day",
                  estimatedDays: 1,
                  dependencies: []
                }
              ]
            },
            {
              name: "MVP Development",
              tasks: [
                {
                  title: "Implement core features",
                  description: "Build the main functionality required for MVP launch.",
                  priority: "high",
                  effort: "5 days",
                  estimatedDays: 5,
                  dependencies: []
                },
                {
                  title: "Test and debug MVP",
                  description: "Run comprehensive tests and fix critical bugs.",
                  priority: "high",
                  effort: "2 days",
                  estimatedDays: 2,
                  dependencies: []
                }
              ]
            }
          ]
        } as TaskPlanResponse;
      }
    });

    const createdTasks = await step.run("create-tasks", async () => {
      const tasks = [];
      
      for (const epic of taskPlan.epics) {
        for (const task of epic.tasks) {
          // Create description with acceptance criteria
          let fullDescription = task.description || "";
          if (task.acceptanceCriteria && task.acceptanceCriteria.length > 0) {
            fullDescription += "\n\nAcceptance Criteria:\n" + 
              task.acceptanceCriteria.map(c => `• ${c}`).join("\n");
          }

          const created = await prisma.task.create({
            data: {
              projectId,
              title: task.title,
              description: fullDescription,
              priority: task.priority || "medium",
              epic: epic.name,
              effort: task.effort || "1 day",
              estimatedDays: task.estimatedDays || 1,
              dependencies: task.dependencies || [],
              assignedBy: "Planner Agent"
            }
          });
          
          tasks.push(created);
        }
      }
      
      return tasks;
    });

    await step.run("log-planning", async () => {
      await prisma.event.create({
        data: {
          projectId,
          name: "project.planned",
          payload: {
            tasksCreated: createdTasks.length,
            epics: taskPlan.epics.map((e: EpicData) => e.name)
          }
        }
      });
    });

    return { success: true, tasksCreated: createdTasks.length };
  }
);