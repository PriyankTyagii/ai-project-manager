import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { Clock, CheckCircle2, AlertCircle, ArrowRight, Layers } from "lucide-react";

interface Project {
  id: string;
  name: string;
  goal: string;
  createdAt: Date;
  tasks: Array<{
    status: string;
  }>;
}

export function ProjectList({ projects }: { projects: Project[] }) {
  if (projects.length === 0) {
    return (
      <div className="bg-white p-16 rounded-2xl border-2 border-dashed border-gray-300 text-center">
        <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Layers className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">No projects yet</h3>
        <p className="text-gray-500">Create your first project above to get started!</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => {
        const totalTasks = project.tasks.length;
        const doneTasks = project.tasks.filter(t => t.status === 'done').length;
        const inProgressTasks = project.tasks.filter(t => t.status === 'in_progress').length;
        const blockedTasks = project.tasks.filter(t => t.status === 'blocked').length;
        const progress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

        return (
          <Link
            key={project.id}
            href={`/project/${project.id}`}
            className="group bg-white rounded-2xl border-2 border-gray-200 hover:border-indigo-500 hover:shadow-2xl transition-all overflow-hidden"
          >
            {/* Project Header */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 border-b border-gray-200">
              <h3 className="font-bold text-xl mb-2 text-gray-900 group-hover:text-indigo-600 transition-colors">
                {project.name}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                {project.goal}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="px-6 pt-6">
              <div className="flex justify-between text-sm font-semibold mb-2">
                <span className="text-gray-700">Progress</span>
                <span className={`${
                  progress === 100 ? 'text-green-600' :
                  progress >= 50 ? 'text-indigo-600' :
                  'text-gray-600'
                }`}>
                  {progress}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div 
                  className={`h-3 rounded-full transition-all duration-500 ${
                    progress === 100 ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                    'bg-gradient-to-r from-indigo-500 to-purple-500'
                  }`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Stats */}
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1.5">
                    <div className="bg-green-100 p-1.5 rounded-lg">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="font-bold text-gray-900">{doneTasks}</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <div className="bg-blue-100 p-1.5 rounded-lg">
                      <Clock className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="font-bold text-gray-900">{inProgressTasks}</span>
                  </div>
                  {blockedTasks > 0 && (
                    <div className="flex items-center space-x-1.5">
                      <div className="bg-red-100 p-1.5 rounded-lg">
                        <AlertCircle className="w-4 h-4 text-red-600" />
                      </div>
                      <span className="font-bold text-gray-900">{blockedTasks}</span>
                    </div>
                  )}
                </div>
                <ArrowRight className="w-5 h-5 text-indigo-600 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Created {formatDate(project.createdAt)}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}