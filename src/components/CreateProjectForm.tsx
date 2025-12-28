"use client";

import { createProject } from "@/app/actions/project";
import { useState, useRef } from "react";
import { Plus, Sparkles } from "lucide-react";

export function CreateProjectForm() {
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    await createProject(formData);
    
    formRef.current?.reset();
    setLoading(false);
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-6">
        <div className="flex items-center space-x-3">
          <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Create New Project</h2>
            <p className="text-white/80 text-sm">Let AI break down your ideas into actionable tasks</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form ref={formRef} onSubmit={handleSubmit} className="p-8 space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Project Name
          </label>
          <input
            name="name"
            required
            className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-lg"
            placeholder="e.g., AI SaaS MVP"
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Project Goal
          </label>
          <textarea
            name="goal"
            required
            rows={4}
            className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-lg resize-none"
            placeholder="Describe what you want to build... Be specific for better AI planning!"
          />
          <p className="text-sm text-gray-500 mt-2">
            💡 Tip: The more detailed your goal, the better the AI can plan your tasks
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 font-bold text-lg shadow-lg hover:shadow-xl transition-all"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              <span>Creating...</span>
            </>
          ) : (
            <>
              <Plus className="w-6 h-6" />
              <span>Create Project</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}