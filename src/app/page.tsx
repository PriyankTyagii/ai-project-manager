import Link from "next/link";
import { Brain, Zap, TrendingUp, Shield, ArrowRight, Sparkles, LogIn } from "lucide-react";
import { getSession } from "@/lib/auth/session";

export default async function HomePage() {
  const session = await getSession();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
      {/* Header with Login Button */}
      <header className="absolute top-0 right-0 p-6">
        {session ? (
          <Link
            href="/dashboard"
            className="flex items-center space-x-2 bg-white text-indigo-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all shadow-lg"
          >
            <span>Go to Dashboard</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        ) : (
          <Link
            href="/login"
            className="flex items-center space-x-2 bg-white text-indigo-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all shadow-lg"
          >
            <LogIn className="w-5 h-5" />
            <span>Sign In</span>
          </Link>
        )}
      </header>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-4 mb-8 animate-fade-in">
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl shadow-2xl">
              <Brain className="w-16 h-16 text-white" />
            </div>
            <h1 className="text-6xl font-bold text-white">
              AI Project Manager
            </h1>
          </div>
          <p className="text-2xl text-white/90 mb-4 font-medium">
            Your Autonomous Scrum Master That Never Sleeps
          </p>
          <p className="text-lg text-white/70 mb-12 max-w-2xl mx-auto">
            Let AI break down projects, detect blockers, and keep your team motivated - automatically
          </p>
          <Link
            href={session ? "/dashboard" : "/signup"}
            className="inline-flex items-center space-x-3 bg-white text-indigo-600 px-10 py-5 rounded-2xl font-bold text-xl hover:bg-gray-100 transition-all hover:scale-105 shadow-2xl"
          >
            <span>{session ? "Go to Dashboard" : "Get Started Free"}</span>
            <ArrowRight className="w-6 h-6" />
          </Link>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-20">
          <FeatureCard
            icon={<Zap className="w-12 h-12 text-yellow-400" />}
            title="Autonomous Planning"
            description="AI breaks down your project into actionable tasks with priorities and estimates"
            gradient="from-yellow-400/20 to-orange-400/20"
          />
          <FeatureCard
            icon={<Shield className="w-12 h-12 text-red-400" />}
            title="Risk Detection"
            description="Automatically detects blockers, delays, and dependency conflicts"
            gradient="from-red-400/20 to-pink-400/20"
          />
          <FeatureCard
            icon={<Sparkles className="w-12 h-12 text-purple-400" />}
            title="Smart Motivation"
            description="Encouraging nudges that keep you on track without being annoying"
            gradient="from-purple-400/20 to-indigo-400/20"
          />
          <FeatureCard
            icon={<TrendingUp className="w-12 h-12 text-green-400" />}
            title="Daily Insights"
            description="AI-generated summaries showing progress, blockers, and priorities"
            gradient="from-green-400/20 to-emerald-400/20"
          />
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-3 gap-8 text-center">
          <StatCard number="10x" label="Faster Planning" />
          <StatCard number="24/7" label="Always Working" />
          <StatCard number="0%" label="Human Error" />
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description, gradient }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
}) {
  return (
    <div className={`bg-gradient-to-br ${gradient} backdrop-blur-sm border border-white/20 p-8 rounded-2xl hover:scale-105 transition-all shadow-xl`}>
      <div className="bg-white/90 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
      <p className="text-white/80 leading-relaxed">{description}</p>
    </div>
  );
}

function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-8 rounded-2xl">
      <div className="text-5xl font-bold text-white mb-2">{number}</div>
      <div className="text-white/70 text-lg">{label}</div>
    </div>
  );
}