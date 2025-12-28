import { prisma } from "@/lib/prisma";
import { CreateProjectForm } from "@/components/CreateProjectForm";
import { ProjectList } from "@/components/ProjectList";
import { Brain, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { AuthButton } from "@/components/AuthButton";

// ✅ Force this page to be dynamic, not pre-rendered at build time
export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const session = await getSession();
  
  if (!session) {
    redirect("/login");
  }

  // 🆕 FILTER PROJECTS BY USER
  const projects = await prisma.project.findMany({
    where: { 
      status: "active",
      userId: session.userId,
    },
    include: {
      tasks: true
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header with Auth Button */}
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3 text-white hover:opacity-80 transition-opacity">
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </Link>
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 backdrop-blur-sm p-2 rounded-xl">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Your Projects</h1>
                <p className="text-white/80 text-sm">Manage all your AI-powered projects</p>
              </div>
            </div>
            {/* 🆕 AUTH BUTTON */}
            <AuthButton user={session} />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12">
          <CreateProjectForm />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Active Projects ({projects.length})</h2>
          <ProjectList projects={projects} />
        </div>
      </div>
    </div>
  );
}
