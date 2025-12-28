import { Brain, Zap, TrendingUp, Shield, ArrowRight, Sparkles, LogIn, CheckCircle2, BarChart3, Clock, GitBranch, Bell } from "lucide-react";

export default function HomePage() {
  const session = false; // Replace with actual session check

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden relative">
      {/* Subtle animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      {/* Header */}
      <header className="relative z-10 flex justify-between items-center p-6 max-w-7xl mx-auto">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-2.5 rounded-xl shadow-lg">
            <Brain className="w-7 h-7 text-white" />
          </div>
          <span className="text-white font-bold text-xl">AI Project Manager</span>
        </div>
        
        {session ? (
          <a
            href="/dashboard"
            className="flex items-center space-x-2 bg-white text-purple-600 px-6 py-2.5 rounded-lg font-semibold hover:bg-gray-50 transition-all shadow-lg"
          >
            <span>Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        ) : (
          <a
            href="/login"
            className="flex items-center space-x-2 bg-white/5 backdrop-blur-sm border border-white/10 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-white/10 transition-all"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In</span>
          </a>
        )}
      </header>

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="text-center mb-20">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-purple-500/10 backdrop-blur-sm border border-purple-500/20 px-4 py-2 rounded-full mb-8">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-purple-200 text-sm font-medium">Powered by OpenAI GPT-4</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Project Management
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              That Runs Itself
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-3 font-normal max-w-3xl mx-auto leading-relaxed">
            AI agents break down projects, detect risks, and generate daily insights
          </p>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Event-driven architecture means your tasks are monitored 24/7—even while you sleep
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-10">
            <a
              href={session ? "/dashboard" : "/signup"}
              className="group inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-purple-600 hover:to-indigo-700 transition-all shadow-xl hover:shadow-2xl hover:scale-105"
            >
              <span>{session ? "Go to Dashboard" : "Start Free"}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            
            <a
              href="https://github.com/PriyankTyagii/ai-project-manager"
              className="inline-flex items-center space-x-2 bg-white/5 backdrop-blur-sm border border-white/10 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/10 transition-all"
            >
              <GitBranch className="w-5 h-5" />
              <span>View on GitHub</span>
            </a>
          </div>

          {/* Trust Indicators */}
          <div className="mt-10 flex flex-wrap justify-center items-center gap-6 text-gray-400 text-sm">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              <span>100% Open Source</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              <span>MIT Licensed</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              <span>Self-Hostable</span>
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
          <FeatureCard
            icon={<Zap className="w-8 h-8" />}
            title="Autonomous Planning"
            description="GPT-4 generates sprint-ready tasks with priorities and estimates in seconds"
            color="purple"
          />
          <FeatureCard
            icon={<Shield className="w-8 h-8" />}
            title="Risk Detection"
            description="Event-driven monitoring detects blockers, delays, and dependency conflicts"
            color="red"
          />
          <FeatureCard
            icon={<Bell className="w-8 h-8" />}
            title="Smart Alerts"
            description="Contextual notifications keep you informed without overwhelming your inbox"
            color="blue"
          />
          <FeatureCard
            icon={<TrendingUp className="w-8 h-8" />}
            title="Daily Reports"
            description="Automated summaries at 8 PM with progress metrics and actionable insights"
            color="green"
          />
        </div>

        {/* How It Works */}
        <div className="mt-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              How It Actually Works
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Event-driven AI agents that respond to your project activity in real-time
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <ProcessCard 
              step="1"
              title="Describe Your Goal"
              description="Enter project details in natural language"
              detail="Example: 'Build a SaaS dashboard with user auth and analytics'"
            />
            <ProcessCard 
              step="2"
              title="AI Generates Tasks"
              description="Planner Agent creates 8-15 actionable tasks"
              detail="Includes priorities, estimates, and dependencies"
            />
            <ProcessCard 
              step="3"
              title="Continuous Monitoring"
              description="Risk Agent tracks progress via event triggers"
              detail="Detects stalls, blockers, and generates daily reports"
            />
          </div>
        </div>

        {/* Technical Details */}
        <div className="mt-32 bg-gradient-to-br from-purple-900/20 to-indigo-900/20 backdrop-blur-sm border border-white/5 rounded-2xl p-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Built for Developers
            </h2>
            <p className="text-gray-400 text-lg">
              Modern stack with event-driven architecture
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <TechCard title="Next.js 14" description="App Router + Server Actions" />
            <TechCard title="Inngest" description="Event orchestration" />
            <TechCard title="Prisma + PostgreSQL" description="Type-safe database" />
            <TechCard title="OpenAI GPT-4" description="Task generation" />
          </div>
        </div>

       

        {/* Final CTA */}
        <div className="mt-32 text-center bg-gradient-to-r from-purple-900/30 to-indigo-900/30 backdrop-blur-sm border border-white/10 rounded-2xl p-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to automate your workflow?
          </h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Deploy your own instance in minutes. No vendor lock-in, no monthly fees.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            
            <a
              href="https://github.com/PriyankTyagii/ai-project-manager"
              className="inline-flex items-center space-x-2 bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-50 transition-all shadow-xl"
            >
              <GitBranch className="w-5 h-5" />
              <span>View Documentation</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description, color }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}) {
  const colorMap = {
    purple: 'from-purple-500/10 to-purple-600/10 border-purple-500/20 text-purple-400',
    red: 'from-red-500/10 to-red-600/10 border-red-500/20 text-red-400',
    blue: 'from-blue-500/10 to-blue-600/10 border-blue-500/20 text-blue-400',
    green: 'from-green-500/10 to-green-600/10 border-green-500/20 text-green-400',
  };

  return (
    <div className={`bg-gradient-to-br ${colorMap[color as keyof typeof colorMap].split(' ')[0]} ${colorMap[color as keyof typeof colorMap].split(' ')[1]} backdrop-blur-sm border ${colorMap[color as keyof typeof colorMap].split(' ')[2]} p-6 rounded-xl hover:scale-105 transition-all duration-300`}>
      <div className={`${colorMap[color as keyof typeof colorMap].split(' ')[3]} mb-4`}>
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function ProcessCard({ step, title, description, detail }: {
  step: string;
  title: string;
  description: string;
  detail: string;
}) {
  return (
    <div className="relative bg-gradient-to-br from-purple-900/20 to-indigo-900/20 backdrop-blur-sm border border-white/10 p-8 rounded-xl hover:border-purple-500/30 transition-all">
      <div className="absolute -top-4 left-8 bg-gradient-to-r from-purple-500 to-indigo-600 text-white w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shadow-lg">
        {step}
      </div>
      <h3 className="text-xl font-bold text-white mb-2 mt-2">{title}</h3>
      <p className="text-gray-300 mb-3 text-sm">{description}</p>
      <p className="text-gray-500 text-xs italic">{detail}</p>
    </div>
  );
}

function TechCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="text-center">
      <div className="text-white font-semibold mb-1">{title}</div>
      <div className="text-gray-400 text-sm">{description}</div>
    </div>
  );
}

function StatCard({ icon, value, label }: { 
  icon: React.ReactNode; 
  value: string; 
  label: string;
}) {
  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-xl text-center hover:bg-white/10 transition-all">
      <div className="flex justify-center mb-3">{icon}</div>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-gray-400 text-sm">{label}</div>
    </div>
  );
}