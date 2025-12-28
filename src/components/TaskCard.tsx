import { Circle, Clock, AlertCircle, CheckCircle2, Brain, Target } from "lucide-react";

interface AgentComment {
  agent: string;
  message: string;
  type: string;
  createdAt: Date;
}

interface Task {
  id: string;
  title: string;
  status: string;
  priority: string;
  epic: string | null;
  effort: string | null;
  dependencies: string[];
  agentComments: AgentComment[];
}

const StatusIcon = ({ status }: { status: string }) => {
  if (status === 'done') return <CheckCircle2 className="w-5 h-5 text-green-500" />;
  if (status === 'in_progress') return <Clock className="w-5 h-5 text-blue-500" />;
  if (status === 'blocked') return <AlertCircle className="w-5 h-5 text-red-500" />;
  return <Circle className="w-5 h-5 text-gray-400" />;
};

export function TaskCard({ task, onClick }: { task: Task; onClick: () => void }) {
  const latestComment = task.agentComments[0];

  const priorityStyles = {
    high: 'bg-red-500 text-white',
    medium: 'bg-yellow-500 text-white',
    low: 'bg-gray-400 text-white',
  };

  return (
    <div 
      onClick={onClick}
      className={`bg-white p-4 rounded-xl border-2 cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 ${
        task.status === 'blocked' ? 'border-red-300 shadow-red-100' : 'border-gray-200'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <StatusIcon status={task.status} />
        <span className={`text-xs px-2 py-1 rounded-full font-bold ${
          priorityStyles[task.priority as keyof typeof priorityStyles] || priorityStyles.low
        }`}>
          {task.priority.toUpperCase()}
        </span>
      </div>
      
      {/* Title - Concise */}
      <h4 className="font-bold text-gray-900 mb-2 leading-tight text-sm">{task.title}</h4>
      
      {/* Epic Badge */}
      {task.epic && (
        <div className="mb-3">
          <span className="inline-flex items-center space-x-1 bg-indigo-50 text-indigo-700 px-2 py-1 rounded-md text-xs font-semibold">
            <Target className="w-3 h-3" />
            <span>{task.epic}</span>
          </span>
        </div>
      )}
      
      {/* Metadata */}
      <div className="flex items-center gap-2 text-xs mb-3">
        {task.effort && (
          <span className="bg-gray-100 px-2 py-1 rounded-md font-medium text-gray-700">
            ⏱️ {task.effort}
          </span>
        )}
        {task.dependencies.length > 0 && (
          <span className="bg-orange-50 text-orange-700 px-2 py-1 rounded-md font-medium">
            🔗 {task.dependencies.length}
          </span>
        )}
      </div>

      {/* Latest Comment */}
      {latestComment && (
        <div className="mt-3 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-100">
          <div className="flex items-center space-x-2 mb-1">
            <Brain className="w-3 h-3 text-indigo-600" />
            <span className="text-xs font-bold text-indigo-900">{latestComment.agent}</span>
          </div>
          <p className="text-xs text-gray-700 leading-relaxed line-clamp-2">{latestComment.message}</p>
        </div>
      )}
    </div>
  );
}