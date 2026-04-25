"use client";

import { useState } from "react";
import Sidebar from "@/app/components/Sidebar";
import URLInput from "@/app/components/URLInput";
import ChatInterface from "@/app/components/ChatInterface";
import ThemeToggle from "@/app/components/ThemeToggle";
import { Menu, Zap } from "lucide-react";

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-[#09090e]">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
      />

      {/* Main */}
      <div className="flex flex-col flex-1 overflow-hidden min-w-0">
        {/* Top bar */}
        <header className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-[#26263a] bg-white dark:bg-[#0f0f16] shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
              aria-label="Open sidebar"
            >
              <Menu size={18} />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg btn-gradient flex items-center justify-center lg:hidden">
                <Zap size={13} className="text-white" />
              </div>
              <span className="font-semibold text-sm text-gray-900 dark:text-gray-100 lg:hidden">
                RAG AI
              </span>
            </div>
            <div className="hidden lg:flex items-center gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-500 font-medium">
                Dashboard
              </span>
            </div>
          </div>
          <ThemeToggle />
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4">
          <URLInput />
          <ChatInterface />
        </main>
      </div>
    </div>
  );
}
