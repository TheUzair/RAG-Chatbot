"use client";

import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMessage } from "@/app/store/chatSlice";
import ReactMarkdown from "react-markdown";

export default function ChatInterface() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.chat.messages);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ query }),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Failed with status ${response.status}: ${errorData}`);
      }

      const data = await response.json();

      dispatch(addMessage({ user: query, bot: data.response }));
      setQuery("");
    } catch (error) {
      console.error("Error sending message:", error);
      dispatch(addMessage({ user: query, bot: "🚨 Error: Unable to process your request. Please try again." }));
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };


  const renderMessageWithHighlight = (message) => {
    const citationRegex = /\*\*Source:\*\* \[Click here\]\((.*?)\)/;
    const match = message.match(citationRegex);

    if (match) {
      const beforeCitation = message.substring(0, match.index);
      const citationUrl = match[1];

      return (
        <div>
          <ReactMarkdown className="prose">{beforeCitation.trim()}</ReactMarkdown>
          <span className="text-blue-600 underline font-semibold ml-1">
            <a href={citationUrl} target="_blank" rel="noopener noreferrer">
              📌 Source
            </a>
          </span>
        </div>
      );
    }

    return <ReactMarkdown className="prose">{message}</ReactMarkdown>;
  };

  return (
    <div className="p-6 border rounded-lg shadow-md bg-white w-full">
      <h2 className="text-xl font-semibold mb-4">💬 Chat Interface</h2>
      <div className="mb-4 h-80 overflow-y-auto p-3 border rounded-md bg-gray-50">
        {messages.map((msg, index) => (
          <div key={index} className="mb-4">
            <p className="bg-blue-100 p-2 rounded-lg inline-block">
              <strong>🧑‍💻 You:</strong> {msg.user}
            </p>
            <div className="bg-gray-100 p-2 rounded-lg inline-block mt-2">
              <strong>🤖 Bot:</strong>
              {renderMessageWithHighlight(msg.bot)}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <div className="flex items-center space-x-2">
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-grow p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          placeholder="Type your message..."
          rows="2"
          disabled={loading}
        />
        <button
          onClick={handleSend}
          className={`p-2 rounded-md text-white transition-colors ${loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
            }`}
          disabled={loading}
        >
          {loading ? "⏳ Sending..." : "📨 Send"}
        </button>
      </div>
    </div>
  );
}