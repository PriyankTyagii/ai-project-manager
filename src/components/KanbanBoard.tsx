"use client";

import { useState } from "react";
import { updateTaskStatus } from "@/app/actions/project";
import { TaskCard } from "./TaskCard";
import { Circle, Clock, AlertCircle, CheckCircle2, X } from "lucide-react";

interface AgentComment {
  agent: string;
  message: string;
  type: string;
  createdAt: Date;
}

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  epic: string | null;
  effort: string | null;
  dependencies: string[];
  agentComments: AgentComment[];
}

export function KanbanBoard({ tasks, projectId }: { tasks: Task[]; projectId: string }) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const columns = {
    backlog: tasks.filter((t: Task) => t.status === 'backlog'),
    in_progress: tasks.filter((t: Task) => t.status === 'in_progress'),
    blocked: tasks.filter((t: Task) => t.status === 'blocked'),
    done: tasks.filter((t: Task) => t.status === 'done')
  };

  return (
    <>
      <div className="grid grid-cols-4 gap-6">
        <Column 
          title="Backlog" 
          icon={<Circle className="w-5 h-5" />}
          tasks={columns.backlog}
          color="gray"
          onTaskClick={setSelectedTask}
        />
        <Column 
          title="In Progress" 
          icon={<Clock className="w-5 h-5" />}
          tasks={columns.in_progress}
          color="blue"
          onTaskClick={setSelectedTask}
        />
        <Column 
          title="Blocked" 
          icon={<AlertCircle className="w-5 h-5" />}
          tasks={columns.blocked}
          color="red"
          onTaskClick={setSelectedTask}
        />
        <Column 
          title="Done" 
          icon={<CheckCircle2 className="w-5 h-5" />}
          tasks={columns.done}
          color="green"
          onTaskClick={setSelectedTask}
        />
      </div>

      {selectedTask && (
        <TaskModal task={selectedTask} onClose={() => setSelectedTask(null)} />
      )}
    </>
  );
}

function Column({ 
  title, 
  icon, 
  tasks, 
  color, 
  onTaskClick 
}: { 
  title: string;
  icon: React.ReactNode;
  tasks: Task[];
  color: 'gray' | 'blue' | 'red' | 'green';
  onTaskClick: (task: Task) => void;
}) {
  const styles = {
    gray: {
      bg: 'bg-gray-50',
      border: 'border-gray-200',
      text: 'text-gray-700',
      headerBg: 'bg-gray-100',
    },
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-700',
      headerBg: 'bg-blue-100',
    },
    red: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-700',
      headerBg: 'bg-red-100',
    },
    green: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-700',
      headerBg: 'bg-green-100',
    }
  };

  const style = styles[color];

  return (
    <div className={`${style.bg} rounded-2xl border-2 ${style.border} overflow-hidden`}>
      <div className={`${style.headerBg} px-4 py-4 border-b-2 ${style.border}`}>
        <div className={`flex items-center justify-between ${style.text}`}>
          <div className="flex items-center space-x-2">
            {icon}
            <span className="font-bold text-lg">{title}</span>
          </div>
          <span className="bg-white px-3 py-1 rounded-full text-sm font-bold">
            {tasks.length}
          </span>
        </div>
      </div>
      <div className="p-4 space-y-3 min-h-[400px]">
        {tasks.length === 0 ? (
          <div className="text-center py-12">
            <div className={`${style.text} opacity-50 text-sm`}>
              No tasks yet
            </div>
          </div>
        ) : (
          tasks.map((task: Task) => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onClick={() => onTaskClick(task)}
            />
          ))
        )}
      </div>
    </div>
  );
}

function TaskModal({ task, onClose }: { task: Task; onClose: () => void }) {
  const handleStatusChange = async (newStatus: string) => {
    await updateTaskStatus(task.id, newStatus);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-6 flex justify-between items-start">
          <div className="flex-1 pr-4">
            <h2 className="text-3xl font-bold text-white mb-2">{task.title}</h2>
            {task.epic && (
              <span className="inline-block bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                {task.epic}
              </span>
            )}
          </div>
          <button 
            onClick={onClose} 
            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm p-2 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          {task.description && (
            <div className="mb-8">
              <h3 className="font-semibold text-gray-900 mb-2 text-lg">Description</h3>
              <p className="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-xl">{task.description}</p>
            </div>
          )}

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <DetailBox label="Status" value={task.status.replace('_', ' ')} />
            <DetailBox label="Priority" value={task.priority} />
            {task.effort && <DetailBox label="Effort" value={task.effort} />}
            {task.dependencies.length > 0 && (
              <DetailBox label="Dependencies" value={`${task.dependencies.length} task(s)`} />
            )}
          </div>

          {/* Agent Comments */}
          {task.agentComments.length > 0 && (
            <div className="mb-8">
              <h3 className="font-semibold text-gray-900 mb-4 text-lg flex items-center space-x-2">
                <Brain className="w-5 h-5 text-indigo-600" />
                <span>AI Agent Comments</span>
              </h3>
              <div className="space-y-3">
                {task.agentComments.map((comment, idx) => (
                  <div key={idx} className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-xl border border-indigo-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-indigo-900">{comment.agent}</span>
                      <span className="text-xs text-indigo-600 bg-white px-2 py-1 rounded-full">
                        {comment.type}
                      </span>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{comment.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <ActionButton 
              onClick={() => handleStatusChange('backlog')}
              label="Backlog"
              color="gray"
            />
            <ActionButton 
              onClick={() => handleStatusChange('in_progress')}
              label="In Progress"
              color="blue"
            />
            <ActionButton 
              onClick={() => handleStatusChange('done')}
              label="Done"
              color="green"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-50 p-4 rounded-xl">
      <div className="text-sm text-gray-500 mb-1 font-medium">{label}</div>
      <div className="font-bold text-gray-900 capitalize">{value}</div>
    </div>
  );
}

function ActionButton({ onClick, label, color }: any) {
  const colors = {
    gray: 'bg-gray-100 hover:bg-gray-200 text-gray-700',
    blue: 'bg-blue-100 hover:bg-blue-200 text-blue-700',
    green: 'bg-green-100 hover:bg-green-200 text-green-700',
  };

  return (
    <button 
      onClick={onClick}
      className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all ${colors[color]}`}
    >
      {label}
    </button>
  );
}