import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Providers from "./components/Providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "RAG AI — Intelligent Knowledge Retrieval",
  description:
    "Scrape any website and chat with an AI that knows its content. Powered by RAG technology.",
  keywords:
    "AI chatbot, Retrieval-Augmented Generation, RAG, AI search, knowledge retrieval",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
        >
          <Providers>{children}</Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
