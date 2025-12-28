"use client";

import { signOut } from "@/lib/firebase/auth";
import { signOutAction } from "@/app/actions/auth";
import { LogOut, User } from "lucide-react";
import { useState } from "react";

interface AuthButtonProps {
  user: {
    name?: string;
    email: string;
    photoURL?: string;
  } | null;
}

export function AuthButton({ user }: AuthButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleSignOut() {
    setLoading(true);
    await signOut();
    await signOutAction();
  }

  if (!user) return null;

  return (
    <div className="flex items-center space-x-3">
      {/* User Info */}
      <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
        {user.photoURL ? (
          <img 
            src={user.photoURL} 
            alt={user.name || "User"} 
            className="w-8 h-8 rounded-full border-2 border-white"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
        )}
        <div className="hidden md:block text-left">
          <div className="text-sm font-semibold text-white">
            {user.name || "User"}
          </div>
          <div className="text-xs text-white/70">
            {user.email}
          </div>
        </div>
      </div>

      {/* Sign Out Button */}
      <button
        onClick={handleSignOut}
        disabled={loading}
        className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-2 rounded-full transition-colors disabled:opacity-50"
        title="Sign out"
      >
        <LogOut className="w-5 h-5" />
      </button>
    </div>
  );
}