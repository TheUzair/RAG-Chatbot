"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { addScrapedUrl } from "@/app/store/chatSlice";
import {
  Globe,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Clock,
  FileText,
  Layers,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

function ScrapeSkeleton() {
  return (
    <div className="space-y-3 pt-1 animate-fade-in">
      <div className="flex items-center gap-2 text-xs text-indigo-500 dark:text-indigo-400 font-medium">
        <div className="w-3.5 h-3.5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin-slow" />
        Extracting content…
      </div>
      <div className="space-y-2.5">
        {[100, 78, 90].map((w, i) => (
          <div
            key={i}
            className="shimmer h-3 rounded"
            style={{ width: `${w}%` }}
          />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-3 pt-1">
        {[1, 2, 3].map((i) => (
          <div key={i} className="shimmer h-14 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export default function URLInput() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [metadata, setMetadata] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const dispatch = useDispatch();

  const isValidUrl = (value) => {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  };

  const handleScrape = async (targetUrl = url) => {
    const trimmed = targetUrl.trim();
    if (!trimmed) {
      setError("Please enter a URL.");
      return;
    }
    if (!isValidUrl(trimmed)) {
      setError(
        "Enter a valid URL including https:// (e.g. https://example.com).",
      );
      return;
    }

    setLoading(true);
    setError("");
    setMetadata(null);

    try {
      const res = await fetch("/api/scrape", {
        method: "POST",
        body: JSON.stringify({ url: trimmed }),
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to scrape the URL.");
      }
      const data = await res.json();
      const host = new URL(trimmed).hostname.replace("www.", "");
      const wordCount =
        data.wordCount ?? (data.text ? data.text.split(/\s+/).length : 0);
      const chunks = data.chunkCount ?? Math.ceil(wordCount / 500);
      const scraped = {
        url: trimmed,
        name: host,
        wordCount,
        chunks,
        timestamp: new Date().toISOString(),
        preview: data.text?.slice(0, 600) || "",
      };
      setMetadata(scraped);
      dispatch(addScrapedUrl(scraped));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center">
          <Globe size={16} className="text-indigo-500 dark:text-indigo-400" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 leading-tight">
            Scrape Website
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            Extract content to chat with AI
          </p>
        </div>
      </div>

      {/* Input row */}
      <div className="flex gap-2.5">
        <div className="relative flex-1">
          <Globe
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-600 pointer-events-none"
          />
          <input
            type="url"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setError("");
            }}
            onKeyDown={(e) => e.key === "Enter" && handleScrape()}
            placeholder="https://example.com"
            disabled={loading}
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-[#26263a] bg-gray-50 dark:bg-[#16161f] text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 dark:focus:border-indigo-600 transition-all disabled:opacity-50"
          />
        </div>
        <button
          onClick={() => handleScrape()}
          disabled={loading}
          className="btn-gradient px-4 py-2.5 text-sm font-semibold rounded-xl flex items-center gap-2 shrink-0"
        >
          {loading ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin-slow" />
              Scraping
            </>
          ) : (
            <>
              <RefreshCw size={14} />
              Scrape
            </>
          )}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 text-sm text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 px-3 py-2.5 rounded-xl animate-fade-in">
          <AlertCircle size={14} className="shrink-0" />
          {error}
        </div>
      )}

      {/* Skeleton while loading */}
      {loading && <ScrapeSkeleton />}

      {/* Success metadata */}
      {metadata && !loading && (
        <div className="space-y-3 animate-fade-slide-in">
          <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 font-medium">
            <CheckCircle size={15} />
            Scraped successfully
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              {
                icon: FileText,
                label: "Words",
                value: metadata.wordCount?.toLocaleString(),
              },
              { icon: Layers, label: "Chunks", value: metadata.chunks },
              { icon: Clock, label: "Status", value: "Live" },
            ].map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="bg-gray-50 dark:bg-[#16161f] border border-gray-100 dark:border-[#26263a] rounded-xl p-3 text-center"
              >
                <Icon size={14} className="mx-auto mb-1 text-indigo-400" />
                <div className="text-sm font-bold text-gray-900 dark:text-gray-100">
                  {value}
                </div>
                <div className="text-[10px] text-gray-500 dark:text-gray-500">
                  {label}
                </div>
              </div>
            ))}
          </div>

          {metadata.preview && (
            <div>
              <button
                onClick={() => setShowPreview((prev) => !prev)}
                className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-500 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors font-medium"
              >
                {showPreview ? (
                  <ChevronUp size={13} />
                ) : (
                  <ChevronDown size={13} />
                )}
                {showPreview ? "Hide" : "Preview"} content
              </button>
              {showPreview && (
                <div className="mt-2 p-3 bg-gray-50 dark:bg-[#16161f] border border-gray-100 dark:border-[#26263a] rounded-xl text-xs text-gray-600 dark:text-gray-400 leading-relaxed max-h-32 overflow-y-auto animate-fade-in">
                  {metadata.preview}…
                </div>
              )}
            </div>
          )}

          <button
            onClick={() => handleScrape()}
            className="text-xs text-gray-400 dark:text-gray-600 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors flex items-center gap-1.5 font-medium"
          >
            <RefreshCw size={11} />
            Re-scrape
          </button>
        </div>
      )}
    </div>
  );
}
