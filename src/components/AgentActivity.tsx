import { Brain, Zap, Shield, TrendingUp, Calendar } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";

interface EventPayload {
  tasksCreated?: number;
  epics?: string[];
  riskType?: string;
}

interface Event {
  id: string;
  name: string;
  payload: EventPayload;
  createdAt: Date;
}

export function AgentActivity({ events }: { events: Event[] }) {
  const getAgentIcon = (eventName: string) => {
    if (eventName.includes('project.planned')) return <Zap className="w-5 h-5 text-blue-600" />;
    if (eventName.includes('task.at_risk') || eventName.includes('task.blocked')) return <Shield className="w-5 h-5 text-red-600" />;
    if (eventName.includes('report.daily')) return <TrendingUp className="w-5 h-5 text-purple-600" />;
    return <Brain className="w-5 h-5 text-indigo-600" />;
  };

  const getAgentColor = (eventName: string) => {
    if (eventName.includes('project.planned')) return 'from-blue-50 to-blue-100 border-blue-200';
    if (eventName.includes('task.at_risk') || eventName.includes('task.blocked')) return 'from-red-50 to-red-100 border-red-200';
    if (eventName.includes('report.daily')) return 'from-purple-50 to-purple-100 border-purple-200';
    return 'from-indigo-50 to-indigo-100 border-indigo-200';
  };

  const getAgentFromEvent = (eventName: string): string => {
    if (eventName.includes('project.planned')) return 'Planner';
    if (eventName.includes('task.at_risk') || eventName.includes('task.blocked')) return 'Risk';
    if (eventName.includes('report.daily')) return 'Report';
    return 'System';
  };

  const getMessageFromEvent = (event: Event): string => {
    if (event.name === 'project.planned') {
      const payload = event.payload;
      return `Created ${payload.tasksCreated || 0} tasks across ${payload.epics?.length || 0} epics`;
    }
    if (event.name === 'report.daily') {
      return 'Generated daily summary report';
    }
    if (event.name === 'task.at_risk') {
      return `Task flagged as at-risk: ${event.payload.riskType || 'unknown'}`;
    }
    return event.name;
  };

  if (events.length === 0) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-gray-200 p-2 rounded-xl">
            <Brain className="w-5 h-5 text-gray-600" />
          </div>
          <h3 className="font-bold text-gray-900 text-lg">Agent Activity</h3>
        </div>
        <div className="text-center py-8">
          <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
            <Calendar className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-600 font-medium">No activity yet</p>
          <p className="text-sm text-gray-500 mt-1">Agents will start working soon!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden shadow-lg">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="bg-white/20 backdrop-blur-sm p-2 rounded-xl">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <h3 className="font-bold text-white text-lg">Agent Activity</h3>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
        {events.slice(0, 10).map((event) => {
          const agent = getAgentFromEvent(event.name);
          const message = getMessageFromEvent(event);
          const icon = getAgentIcon(event.name);
          const colorClass = getAgentColor(event.name);
          
          return (
            <div 
              key={event.id} 
              className={`bg-gradient-to-r ${colorClass} p-4 rounded-xl border-2 hover:scale-102 transition-transform`}
            >
              <div className="flex items-start space-x-3">
                <div className="bg-white p-2 rounded-lg shadow-sm flex-shrink-0">
                  {icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-gray-900 text-sm">{agent} Agent</span>
                    <span className="text-xs text-gray-500 font-medium bg-white px-2 py-1 rounded-full">
                      {formatRelativeTime(event.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{message}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="bg-gray-50 px-6 py-3 border-t-2 border-gray-200">
        <p className="text-xs text-gray-500 text-center font-medium">
          🤖 All agents are actively monitoring your project
        </p>
      </div>
    </div>
  );
}