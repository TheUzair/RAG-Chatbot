"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMessage, clearMessages } from "@/app/store/chatSlice";
import ReactMarkdown from "react-markdown";
import { Send, Trash2, Bot, User, ExternalLink, Sparkles } from "lucide-react";
import { SkeletonBubble } from "@/app/components/Skeleton";

function StreamingBubble({ text }) {
  return (
    <div className="flex gap-3 animate-fade-slide-in">
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shrink-0 mt-0.5">
        <Bot size={13} className="text-white" />
      </div>
      <div className="flex-1 max-w-[85%]">
        <div className="inline-block px-4 py-3 rounded-2xl rounded-tl-sm bg-white dark:bg-[#16161f] border border-gray-100 dark:border-[#26263a] shadow-sm">
          {text ? (
            <div className="markdown-content text-gray-800 dark:text-gray-200">
              <ReactMarkdown>{text}</ReactMarkdown>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 py-0.5">
              <span className="pulse-dot" />
              <span className="pulse-dot" />
              <span className="pulse-dot" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SourceChip({ url }) {
  if (!url) return null;
  let displayUrl = url;
  try {
    displayUrl = new URL(url).hostname;
  } catch {
    /* keep original */
  }
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50 hover:bg-indigo-100 dark:hover:bg-indigo-950/60 transition-colors font-medium"
    >
      <ExternalLink size={9} />
      {displayUrl}
    </a>
  );
}

export default function ChatInterface() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.chat.messages);
  const chatEndRef = useRef(null);
  const streamTimerRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingText, loading]);

  useEffect(() => {
    return () => {
      if (streamTimerRef.current) clearTimeout(streamTimerRef.current);
    };
  }, []);

  const streamResponse = useCallback((fullText, onDone) => {
    const words = fullText.split(" ");
    let i = 0;
    setIsStreaming(true);
    setStreamingText("");

    const step = () => {
      i++;
      setStreamingText(words.slice(0, i).join(" "));
      if (i < words.length) {
        streamTimerRef.current = setTimeout(step, 20);
      } else {
        setIsStreaming(false);
        onDone();
      }
    };
    streamTimerRef.current = setTimeout(step, 20);
  }, []);

  const handleSend = useCallback(async () => {
    const trimmed = query.trim();
    if (!trimmed || loading || isStreaming) return;

    setLoading(true);
    const currentQuery = trimmed;
    setQuery("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ query: currentQuery }),
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Request failed (${res.status})`);
      }
      const data = await res.json();
      setLoading(false);
      streamResponse(data.response, () => {
        dispatch(
          addMessage({
            user: currentQuery,
            bot: data.response,
            sourceUrl: data.sourceUrl || null,
          }),
        );
        setStreamingText("");
      });
    } catch (err) {
      setLoading(false);
      dispatch(
        addMessage({
          user: currentQuery,
          bot: `Error: ${err.message}`,
          sourceUrl: null,
        }),
      );
    }
  }, [query, loading, isStreaming, dispatch, streamResponse]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isEmpty = messages.length === 0 && !loading && !isStreaming;

  return (
    <div
      className="glass-card flex flex-col"
      style={{ height: "calc(100vh - 330px)", minHeight: "380px" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 dark:border-[#26263a] shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-violet-50 dark:bg-violet-950/30 flex items-center justify-center">
            <Sparkles
              size={15}
              className="text-violet-500 dark:text-violet-400"
            />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 leading-tight">
              AI Chat
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              {messages.length > 0
                ? `${messages.length} message${messages.length > 1 ? "s" : ""}`
                : "Ask anything about the scraped content"}
            </p>
          </div>
        </div>
        {messages.length > 0 && (
          <button
            onClick={() => dispatch(clearMessages())}
            className="w-8 h-8 flex items-center justify-center rounded-xl text-gray-400 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all duration-150"
            aria-label="Clear chat"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {isEmpty && (
          <div className="flex flex-col items-center justify-center h-full text-center py-10 animate-fade-in">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-100 to-violet-100 dark:from-indigo-950/40 dark:to-violet-950/30 flex items-center justify-center mb-3">
              <Bot size={26} className="text-indigo-400" />
            </div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Ready to chat
            </h3>
            <p className="text-xs text-gray-400 dark:text-gray-600 max-w-[200px] leading-relaxed">
              Scrape a website above, then ask anything about its content.
            </p>
          </div>
        )}

        {messages.map((msg, index) => (
          <div
            key={msg.id || index}
            className="space-y-4 animate-fade-slide-in"
          >
            {/* User bubble */}
            <div className="flex gap-3 justify-end">
              <div className="max-w-[85%]">
                <div className="px-4 py-3 rounded-2xl rounded-tr-sm bg-indigo-600 dark:bg-indigo-700 text-white text-sm leading-relaxed">
                  {msg.user}
                </div>
              </div>
              <div className="w-7 h-7 rounded-full bg-gray-200 dark:bg-[#26263a] flex items-center justify-center shrink-0 mt-0.5">
                <User size={13} className="text-gray-600 dark:text-gray-400" />
              </div>
            </div>

            {/* Bot bubble */}
            <div className="flex gap-3">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shrink-0 mt-0.5">
                <Bot size={13} className="text-white" />
              </div>
              <div className="flex-1 max-w-[85%] space-y-2">
                <div className="inline-block px-4 py-3 rounded-2xl rounded-tl-sm bg-white dark:bg-[#16161f] border border-gray-100 dark:border-[#26263a] shadow-sm">
                  <div className="markdown-content text-gray-800 dark:text-gray-200">
                    <ReactMarkdown>{msg.bot}</ReactMarkdown>
                  </div>
                </div>
                {msg.sourceUrl && (
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-400 dark:text-gray-600 font-medium">
                      Source:
                    </span>
                    <SourceChip url={msg.sourceUrl} />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Loading skeleton (waiting for API) */}
        {loading && !isStreaming && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex gap-3 justify-end">
              <div className="max-w-[70%]">
                <div className="px-4 py-3 rounded-2xl rounded-tr-sm bg-indigo-600 dark:bg-indigo-700 text-white text-sm opacity-80">
                  {query || "…"}
                </div>
              </div>
              <div className="w-7 h-7 rounded-full bg-gray-200 dark:bg-[#26263a] flex items-center justify-center shrink-0">
                <User size={13} className="text-gray-600 dark:text-gray-400" />
              </div>
            </div>
            <SkeletonBubble align="left" />
          </div>
        )}

        {/* Streaming bubble */}
        {isStreaming && <StreamingBubble text={streamingText} />}

        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3.5 border-t border-gray-100 dark:border-[#26263a] shrink-0">
        <div className="flex items-end gap-3">
          <textarea
            ref={textareaRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onInput={(e) => {
              e.target.style.height = "auto";
              e.target.style.height =
                Math.min(e.target.scrollHeight, 160) + "px";
            }}
            placeholder="Ask about the scraped content…"
            rows={1}
            disabled={loading || isStreaming}
            className="chat-input flex-1 px-4 py-3 text-sm rounded-2xl border border-gray-200 dark:border-[#26263a] bg-gray-50 dark:bg-[#16161f] text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 resize-none leading-relaxed transition-all disabled:opacity-50 max-h-40 overflow-y-auto"
            style={{ minHeight: "46px" }}
          />
          <button
            onClick={handleSend}
            disabled={!query.trim() || loading || isStreaming}
            className="btn-gradient w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 mb-[1px]"
            aria-label="Send message"
          >
            <Send size={16} />
          </button>
        </div>
        <p className="text-[10px] text-gray-400 dark:text-gray-600 mt-2 text-center">
          Press{" "}
          <kbd className="px-1 py-0.5 rounded bg-gray-100 dark:bg-[#26263a] text-gray-500 dark:text-gray-500 font-mono text-[9px]">
            Enter
          </kbd>{" "}
          to send ·{" "}
          <kbd className="px-1 py-0.5 rounded bg-gray-100 dark:bg-[#26263a] text-gray-500 dark:text-gray-500 font-mono text-[9px]">
            Shift+Enter
          </kbd>{" "}
          for new line
        </p>
      </div>
    </div>
  );
}
