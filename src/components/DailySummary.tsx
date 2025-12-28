import { prisma } from "@/lib/prisma";
import { TrendingUp, Calendar, Target, Zap } from "lucide-react";

interface ReportMetrics {
  completed: number;
  inProgress: number;
  blocked: number;
  velocity: string;
}

interface ReportPayload {
  date: string;
  metrics: ReportMetrics;
  insights: string[];
  nextPriorities: string[];
}

export async function DailySummary({ projectId }: { projectId: string }) {
  const latestReport = await prisma.event.findFirst({
    where: { projectId, name: "report.daily" },
    orderBy: { createdAt: "desc" },
  });

  if (!latestReport) {
    return (
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border-2 border-indigo-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-indigo-100 p-2 rounded-xl">
            <Calendar className="w-5 h-5 text-indigo-600" />
          </div>
          <h3 className="font-bold text-gray-900 text-lg">Daily Summary</h3>
        </div>
        <div className="text-center py-8">
          <div className="bg-white/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
            <Zap className="w-8 h-8 text-indigo-400" />
          </div>
          <p className="text-gray-600 font-medium mb-2">Report generates at 8 PM daily</p>
          <p className="text-sm text-gray-500">Check back then!</p>
        </div>
      </div>
    );
  }

  // ✅ Cast safely through unknown
  const report = latestReport.payload as unknown as ReportPayload;

  // Optional runtime check
  if (
    !report ||
    typeof report !== "object" ||
    !("date" in report) ||
    !("metrics" in report) ||
    !("insights" in report) ||
    !("nextPriorities" in report)
  ) {
    return <p className="text-gray-600">Invalid report data</p>;
  }

  return (
    <div className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden shadow-lg">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="bg-white/20 backdrop-blur-sm p-2 rounded-xl">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <h3 className="font-bold text-white text-lg">Today Summary</h3>
        </div>
      </div>

      {/* Metrics */}
      <div className="p-6 space-y-4">
        <MetricRow
          icon={<Target className="w-5 h-5 text-green-600" />}
          label="Completed"
          value={report.metrics.completed}
          color="green"
        />
        <MetricRow
          icon={<Zap className="w-5 h-5 text-blue-600" />}
          label="In Progress"
          value={report.metrics.inProgress}
          color="blue"
        />
        <MetricRow
          icon={<TrendingUp className="w-5 h-5 text-indigo-600" />}
          label="Velocity"
          value={report.metrics.velocity}
          color="indigo"
        />
      </div>

      {/* Insights */}
      {report.insights.length > 0 && (
        <div className="px-6 pb-6">
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-200">
            <div className="flex items-center space-x-2 mb-3">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              <span className="text-sm font-bold text-gray-900">AI Insights</span>
            </div>
            <div className="space-y-2">
              {report.insights.slice(0, 2).map((insight, idx) => (
                <p
                  key={idx}
                  className="text-xs text-gray-700 leading-relaxed pl-6 relative"
                >
                  <span className="absolute left-0 top-1 w-2 h-2 bg-indigo-400 rounded-full"></span>
                  {insight}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MetricRow({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  color: "green" | "blue" | "indigo";
}) {
  const colors = {
    green: "bg-green-50 border-green-200",
    blue: "bg-blue-50 border-blue-200",
    indigo: "bg-indigo-50 border-indigo-200",
  };

  return (
    <div
      className={`flex items-center justify-between p-3 rounded-xl border-2 ${colors[color]}`}
    >
      <div className="flex items-center space-x-3">
        <div className="bg-white p-2 rounded-lg shadow-sm">{icon}</div>
        <span className="font-semibold text-gray-700">{label}</span>
      </div>
      <span className="text-2xl font-bold text-gray-900">{value}</span>
    </div>
  );
}
