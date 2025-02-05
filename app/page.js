import React from "react";
import URLInput from "@/app/components/URLInput";
import ChatInterface from "@/app/components/ChatInterface";

export default function Home() {
  const currYear = new Date().getFullYear();
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="bg-blue-600 text-white p-6 shadow-md">
        <h1 className="text-3xl font-bold">RAG Chatbot</h1>
      </header>
      <main className="flex-grow p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          <URLInput />
          <ChatInterface />
        </div>
      </main>
      <footer className="bg-gray-800 text-white p-4 text-center">
        <p>&copy; {currYear} RAG Chatbot. All rights reserved.</p>
      </footer>
    </div>
  );
}