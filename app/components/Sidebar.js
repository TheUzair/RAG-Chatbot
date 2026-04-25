"use client";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTheme } from "next-themes";
import {
  setActiveUrl,
  clearMessages,
  removeScrapedUrl,
  clearScrapedUrls,
} from "@/app/store/chatSlice";
import {
  X,
  Zap,
  LayoutDashboard,
  History,
  Settings,
  Globe,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Monitor,
  Database,
  Calendar,
  Search,
} from "lucide-react";

const navItems = [
  { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { id: "history", icon: History, label: "History" },
  { id: "settings", icon: Settings, label: "Settings" },
];

function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now - d;
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffD = Math.floor(diffHr / 24);
  if (diffD < 7) return `${diffD}d ago`;
  return d.toLocaleDateString();
}

function DashboardView({ scrapedUrls, activeUrl, dispatch }) {
  return (
    <>
      <div className="flex items-center justify-between mb-2 px-1">
        <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-wider">
          Recent
        </span>
        <span className="text-[10px] text-gray-400 dark:text-gray-600 tabular-nums">
          {scrapedUrls.length}
        </span>
      </div>

      {scrapedUrls.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center mb-2">
            <Globe size={18} className="text-gray-300 dark:text-gray-700" />
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-600">
            No URLs scraped yet
          </p>
        </div>
      ) : (
        <div className="space-y-0.5">
          {scrapedUrls.slice(0, 8).map((item) => (
            <button
              key={item.id}
              onClick={() => dispatch(setActiveUrl(item.url))}
              className={[
                "w-full text-left px-3 py-2.5 rounded-xl transition-all duration-150",
                activeUrl === item.url
                  ? "bg-indigo-50 dark:bg-indigo-950/40"
                  : "hover:bg-gray-100 dark:hover:bg-white/5",
              ].join(" ")}
            >
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-md bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shrink-0">
                  <Globe size={10} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    className={`text-xs font-medium truncate ${
                      activeUrl === item.url
                        ? "text-indigo-600 dark:text-indigo-400"
                        : "text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {item.name}
                  </div>
                  <div className="text-[10px] text-gray-400 dark:text-gray-600 truncate">
                    {item.wordCount?.toLocaleString()} words
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </>
  );
}

function HistoryView({ scrapedUrls, activeUrl, dispatch }) {
  const [search, setSearch] = useState("");
  const filtered = scrapedUrls.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.url.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search
          size={12}
          className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-600 pointer-events-none"
        />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search history…"
          className="w-full pl-7 pr-2 py-2 text-xs rounded-lg border border-gray-200 dark:border-[#26263a] bg-gray-50 dark:bg-[#16161f] text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
        />
      </div>

      <div className="flex items-center justify-between px-1">
        <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-wider">
          All History
        </span>
        {scrapedUrls.length > 0 && (
          <button
            onClick={() => {
              if (confirm("Clear all history?")) dispatch(clearScrapedUrls());
            }}
            className="text-[10px] text-gray-400 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 transition-colors font-medium"
          >
            Clear all
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center mb-2">
            <History size={18} className="text-gray-300 dark:text-gray-700" />
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-600">
            {scrapedUrls.length === 0 ? "No history yet" : "No matches"}
          </p>
        </div>
      ) : (
        <div className="space-y-0.5">
          {filtered.map((item) => (
            <div
              key={item.id}
              className={[
                "group rounded-xl transition-all duration-150 flex items-center",
                activeUrl === item.url
                  ? "bg-indigo-50 dark:bg-indigo-950/40"
                  : "hover:bg-gray-100 dark:hover:bg-white/5",
              ].join(" ")}
            >
              <button
                onClick={() => dispatch(setActiveUrl(item.url))}
                className="flex-1 text-left px-3 py-2.5 min-w-0"
              >
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-md bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shrink-0">
                    <Globe size={10} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div
                      className={`text-xs font-medium truncate ${
                        activeUrl === item.url
                          ? "text-indigo-600 dark:text-indigo-400"
                          : "text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {item.name}
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-gray-400 dark:text-gray-600">
                      <Calendar size={9} />
                      {formatDate(item.timestamp)}
                      <span>·</span>
                      {item.wordCount?.toLocaleString()}w
                    </div>
                  </div>
                </div>
              </button>
              <button
                onClick={() => dispatch(removeScrapedUrl(item.url))}
                className="opacity-0 group-hover:opacity-100 w-7 h-7 mr-2 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all shrink-0"
                aria-label="Remove"
              >
                <Trash2 size={11} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SettingsView({ dispatch, scrapedUrls, messages }) {
  const { theme, setTheme } = useTheme();
  const themeOptions = [
    { id: "light", icon: Sun, label: "Light" },
    { id: "dark", icon: Moon, label: "Dark" },
    { id: "system", icon: Monitor, label: "System" },
  ];

  return (
    <div className="space-y-5">
      {/* Appearance */}
      <div>
        <h4 className="text-[10px] font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-wider mb-2 px-1">
          Appearance
        </h4>
        <div className="grid grid-cols-3 gap-1.5">
          {themeOptions.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setTheme(id)}
              className={[
                "flex flex-col items-center gap-1 py-2.5 rounded-xl border transition-all duration-150",
                theme === id
                  ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400"
                  : "border-gray-200 dark:border-[#26263a] text-gray-500 dark:text-gray-500 hover:border-gray-300 dark:hover:border-[#3a3a4f]",
              ].join(" ")}
            >
              <Icon size={14} />
              <span className="text-[10px] font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div>
        <h4 className="text-[10px] font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-wider mb-2 px-1">
          Statistics
        </h4>
        <div className="space-y-1">
          <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-50 dark:bg-[#16161f] text-xs">
            <span className="text-gray-500 dark:text-gray-500">
              Scraped sites
            </span>
            <span className="font-semibold text-gray-700 dark:text-gray-300 tabular-nums">
              {scrapedUrls.length}
            </span>
          </div>
          <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-50 dark:bg-[#16161f] text-xs">
            <span className="text-gray-500 dark:text-gray-500">Messages</span>
            <span className="font-semibold text-gray-700 dark:text-gray-300 tabular-nums">
              {messages.length}
            </span>
          </div>
        </div>
      </div>

      {/* Data */}
      <div>
        <h4 className="text-[10px] font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-wider mb-2 px-1">
          Data
        </h4>
        <div className="space-y-1.5">
          <button
            onClick={() => {
              if (confirm("Clear conversation?")) dispatch(clearMessages());
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-all"
          >
            <Trash2 size={13} />
            Clear conversation
          </button>
          <button
            onClick={() => {
              if (confirm("Clear all scraped history?"))
                dispatch(clearScrapedUrls());
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-all"
          >
            <Database size={13} />
            Clear scrape history
          </button>
        </div>
      </div>

      <div className="pt-2 border-t border-gray-100 dark:border-[#26263a]">
        <p className="text-[10px] text-gray-400 dark:text-gray-600 text-center">
          RAG AI · v1.0
        </p>
      </div>
    </div>
  );
}

export default function Sidebar({
  open,
  onClose,
  collapsed,
  onToggleCollapse,
}) {
  const dispatch = useDispatch();
  const { scrapedUrls, activeUrl, messages } = useSelector(
    (state) => state.chat,
  );
  const [view, setView] = useState("dashboard");

  const isCollapsed = collapsed && !open;

  return (
    <aside
      className={[
        "fixed lg:relative inset-y-0 left-0 z-30 flex flex-col",
        "bg-white dark:bg-[#0b0b12]",
        "border-r border-gray-200 dark:border-[#26263a]",
        "sidebar-transition",
        isCollapsed ? "w-[68px]" : "w-64",
        "shrink-0",
        open ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
      ].join(" ")}
    >
      {/* Logo */}
      <div
        className={[
          "flex items-center border-b border-gray-200 dark:border-[#26263a]",
          isCollapsed
            ? "px-3 py-4 justify-center"
            : "px-5 py-4 justify-between",
        ].join(" ")}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl btn-gradient flex items-center justify-center shrink-0">
            <Zap size={15} className="text-white" />
          </div>
          {!isCollapsed && (
            <div className="min-w-0">
              <div className="font-bold text-gray-900 dark:text-gray-100 text-sm tracking-tight leading-tight truncate">
                RAG AI
              </div>
              <div className="text-[10px] text-gray-400 dark:text-gray-600 font-medium">
                Knowledge Retrieval
              </div>
            </div>
          )}
        </div>
        {!isCollapsed && (
          <button
            onClick={onClose}
            className="lg:hidden w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
            aria-label="Close sidebar"
          >
            <X size={15} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav
        className={
          isCollapsed ? "px-2 py-3 space-y-0.5" : "px-3 py-3 space-y-0.5"
        }
      >
        {navItems.map(({ id, icon: Icon, label }) => {
          const active = view === id;
          return (
            <button
              key={id}
              onClick={() => setView(id)}
              title={isCollapsed ? label : undefined}
              className={[
                "w-full flex items-center rounded-xl text-sm font-medium transition-all duration-150",
                isCollapsed
                  ? "justify-center px-0 py-2.5"
                  : "gap-3 px-3 py-2.5 text-left",
                active
                  ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-gray-200",
              ].join(" ")}
            >
              <Icon size={16} />
              {!isCollapsed && label}
            </button>
          );
        })}
      </nav>

      <div className="mx-4 h-px bg-gray-100 dark:bg-[#26263a]" />

      {/* View content */}
      {!isCollapsed && (
        <div className="flex-1 overflow-y-auto px-3 py-3 animate-fade-in">
          {view === "dashboard" && (
            <DashboardView
              scrapedUrls={scrapedUrls}
              activeUrl={activeUrl}
              dispatch={dispatch}
            />
          )}
          {view === "history" && (
            <HistoryView
              scrapedUrls={scrapedUrls}
              activeUrl={activeUrl}
              dispatch={dispatch}
            />
          )}
          {view === "settings" && (
            <SettingsView
              dispatch={dispatch}
              scrapedUrls={scrapedUrls}
              messages={messages}
            />
          )}
        </div>
      )}

      {isCollapsed && <div className="flex-1" />}

      {/* Bottom: collapse toggle (desktop only) */}
      <div className="p-2 border-t border-gray-100 dark:border-[#26263a] hidden lg:block">
        <button
          onClick={onToggleCollapse}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={[
            "w-full flex items-center rounded-xl text-xs font-medium text-gray-500 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-700 dark:hover:text-gray-300 transition-all duration-150",
            isCollapsed ? "justify-center py-2.5" : "gap-2 px-3 py-2.5",
          ].join(" ")}
        >
          {isCollapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
          {!isCollapsed && "Collapse"}
        </button>
      </div>
    </aside>
  );
}
