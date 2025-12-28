import { Brain, Zap, Shield, TrendingUp, Calendar } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";

/* ✅ EXPORT payload type */
export interface EventPayload {
  tasksCreated?: number;
  epics?: string[];
  riskType?: string;
}

/* ✅ EXPORT Event type */
export interface Event {
  id: string;
  name: string;
  payload: EventPayload | null;
  createdAt: Date;
}

export function AgentActivity({ events }: { events: Event[] }) {
  const getAgentIcon = (eventName: string) => {
    if (eventName.includes("project.planned"))
      return <Zap className="w-5 h-5 text-blue-600" />;
    if (
      eventName.includes("task.at_risk") ||
      eventName.includes("task.blocked")
    )
      return <Shield className="w-5 h-5 text-red-600" />;
    if (eventName.includes("report.daily"))
      return <TrendingUp className="w-5 h-5 text-purple-600" />;
    return <Brain className="w-5 h-5 text-indigo-600" />;
  };

  const getAgentColor = (eventName: string) => {
    if (eventName.includes("project.planned"))
      return "from-blue-50 to-blue-100 border-blue-200";
    if (
      eventName.includes("task.at_risk") ||
      eventName.includes("task.blocked")
    )
      return "from-red-50 to-red-100 border-red-200";
    if (eventName.includes("report.daily"))
      return "from-purple-50 to-purple-100 border-purple-200";
    return "from-indigo-50 to-indigo-100 border-indigo-200";
  };

  const getAgentFromEvent = (eventName: string): string => {
    if (eventName.includes("project.planned")) return "Planner";
    if (
      eventName.includes("task.at_risk") ||
      eventName.includes("task.blocked")
    )
      return "Risk";
    if (eventName.includes("report.daily")) return "Report";
    return "System";
  };

  const getMessageFromEvent = (event: Event): string => {
    if (event.name === "project.planned") {
      return `Created ${event.payload?.tasksCreated ?? 0} tasks across ${
        event.payload?.epics?.length ?? 0
      } epics`;
    }

    if (event.name === "report.daily") {
      return "Generated daily summary report";
    }

    if (event.name === "task.at_risk") {
      return `Task flagged as at-risk: ${
        event.payload?.riskType ?? "unknown"
      }`;
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
          <h3 className="font-bold text-gray-900 text-lg">
            Agent Activity
          </h3>
        </div>
        <div className="text-center py-8">
          <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
            <Calendar className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-600 font-medium">No activity yet</p>
          <p className="text-sm text-gray-500 mt-1">
            Agents will start working soon!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden shadow-lg">
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="bg-white/20 backdrop-blur-sm p-2 rounded-xl">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <h3 className="font-bold text-white text-lg">
            Agent Activity
          </h3>
        </div>
      </div>

      <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
        {events.slice(0, 10).map((event) => (
          <div
            key={event.id}
            className={`bg-gradient-to-r ${getAgentColor(
              event.name
            )} p-4 rounded-xl border-2`}
          >
            <div className="flex items-start space-x-3">
              <div className="bg-white p-2 rounded-lg shadow-sm">
                {getAgentIcon(event.name)}
              </div>
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="font-bold text-sm">
                    {getAgentFromEvent(event.name)} Agent
                  </span>
                  <span className="text-xs bg-white px-2 py-1 rounded-full">
                    {formatRelativeTime(event.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-gray-700">
                  {getMessageFromEvent(event)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
