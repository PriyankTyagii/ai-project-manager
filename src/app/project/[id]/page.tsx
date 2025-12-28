import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { KanbanBoard } from "@/components/KanbanBoard";
import { DailySummary } from "@/components/DailySummary";
import { AgentActivity, type Event, type EventPayload } from "@/components/AgentActivity";
import {
  Brain,
  ArrowLeft,
  Activity,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { AuthButton } from "@/components/AuthButton";

// ✅ Force this page to be dynamic, not pre-rendered at build time
export const dynamic = 'force-dynamic';

export default async function ProjectPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const project = await prisma.project.findFirst({
    where: {
      id: params.id,
      userId: session.userId,
    },
    include: {
      tasks: {
        include: { agentComments: true },
        orderBy: { createdAt: "desc" },
      },
      events: {
        orderBy: { createdAt: "desc" },
        take: 20,
      },
    },
  });

  if (!project) notFound();

  /* ✅ STRICTLY NORMALIZE PRISMA JSON → EventPayload */
  const normalizedEvents: Event[] = project.events.map((event) => {
    let payload: EventPayload | null = null;

    if (
      event.payload &&
      typeof event.payload === "object" &&
      !Array.isArray(event.payload)
    ) {
      payload = event.payload as EventPayload;
    }

    return {
      id: event.id,
      name: event.name,
      createdAt: event.createdAt,
      payload,
    };
  });

  const stats = {
    total: project.tasks.length,
    done: project.tasks.filter((t) => t.status === "done").length,
    inProgress: project.tasks.filter(
      (t) => t.status === "in_progress"
    ).length,
    blocked: project.tasks.filter((t) => t.status === "blocked").length,
  };

  const velocity =
    stats.total > 0
      ? Math.round((stats.done / stats.total) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <Link
              href="/dashboard"
              className="flex items-center space-x-2 text-white hover:opacity-80 transition-opacity"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="font-medium text-sm">
                Back to Dashboard
              </span>
            </Link>

            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <Activity className="w-4 h-4 text-white" />
                <span className="text-white font-semibold text-sm">
                  {velocity}% Complete
                </span>
              </div>

              <AuthButton user={session} />
            </div>
          </div>

          <div className="flex items-center space-x-3 mb-3">
            <div className="bg-white/20 backdrop-blur-sm p-2 rounded-xl">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">
              {project.name}
            </h1>
          </div>

          <details className="group">
            <summary className="cursor-pointer text-white/90 text-sm font-medium flex items-center space-x-2 hover:text-white">
              <span>View Project Details</span>
              <ChevronDown className="w-4 h-4 group-open:hidden" />
              <ChevronUp className="w-4 h-4 hidden group-open:block" />
            </summary>
            <div className="mt-2 bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-white/90 text-sm leading-relaxed">
                {project.goal}
              </p>
            </div>
          </details>
        </div>

        {/* Stats */}
        <div className="bg-white/10 backdrop-blur-sm border-t border-white/20">
          <div className="max-w-7xl mx-auto px-6 py-3">
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-xl font-bold text-white">
                  {stats.total}
                </div>
                <div className="text-white/70 text-xs font-medium">
                  Total
                </div>
              </div>
              <div>
                <div className="text-xl font-bold text-green-300">
                  {stats.done}
                </div>
                <div className="text-white/70 text-xs font-medium">
                  Done
                </div>
              </div>
              <div>
                <div className="text-xl font-bold text-blue-300">
                  {stats.inProgress}
                </div>
                <div className="text-white/70 text-xs font-medium">
                  In Progress
                </div>
              </div>
              <div>
                <div className="text-xl font-bold text-red-300">
                  {stats.blocked}
                </div>
                <div className="text-white/70 text-xs font-medium">
                  Blocked
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <KanbanBoard
              tasks={project.tasks}
              projectId={project.id}
            />
          </div>
          <div className="space-y-6">
            <DailySummary projectId={project.id} />
            <AgentActivity events={normalizedEvents} />
          </div>
        </div>
      </div>
    </div>
  );
}
