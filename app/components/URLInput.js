"use client";

import { useState } from "react";

export default function URLInput() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [websiteName, setWebsiteName] = useState("");

  const handleScrape = async () => {
    if (!url.trim()) {
      setError("⚠️ Please enter a valid URL.");
      return;
    }

    setLoading(true);
    setError("");
    setWebsiteName("");

    try {
      const response = await fetch("/api/scrape", {
        method: "POST",
        body: JSON.stringify({ url }),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("❌ Failed to scrape the URL.");
      }

      const data = await response.json();
      setWebsiteName(data.websiteName || "Website scraped successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 border rounded-lg shadow-md bg-white w-full">
      <h2 className="text-xl font-semibold mb-4">🌍 Scrape Website</h2>
      <div className="flex items-center space-x-2">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter website URL..."
          className="flex-grow p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
        <button
          onClick={handleScrape}
          className={`p-2 rounded-md text-white transition-colors ${loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
            }`}
          disabled={loading}
        >
          {loading ? "⏳ Scraping..." : "🔍 Scrape"}
        </button>
      </div>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}