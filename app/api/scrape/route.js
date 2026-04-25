import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import { NextResponse } from "next/server";
import weaviateClient from "@/app/lib/weaviateClient";

export async function POST(req) {
  try {
    const { url } = await req.json();
    if (!url) {
      console.error("No URL provided");
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }
    console.log(`Launching Puppeteer to scrape: ${url}`);
    let browser;
    if (process.env.VERCEL) {
      console.log("Running on Vercel with @sparticuz/chromium");
      browser = await puppeteer.launch({
        args: chromium.args,
        executablePath: await chromium.executablePath(),
        headless: chromium.headless,
      });
    } else {
      console.log("Running locally with installed Puppeteer");
      browser = await puppeteer.launch({
        executablePath:
          process.env.PUPPETEER_EXECUTABLE_PATH ||
          "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
        headless: true,
      });
    }
    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
    );
    await page.goto(url, { waitUntil: "networkidle2", timeout: 45000 });

    const { title, text } = await page.evaluate(() => {
      // Remove non-content elements
      const junkSelectors = [
        "script",
        "style",
        "noscript",
        "iframe",
        "nav",
        "header",
        "footer",
        "aside",
        "form",
        "svg",
        "[role='navigation']",
        "[role='banner']",
        "[role='contentinfo']",
        "[aria-hidden='true']",
        ".nav",
        ".navbar",
        ".navigation",
        ".menu",
        ".sidebar",
        ".header",
        ".footer",
        ".cookie",
        ".cookies",
        ".banner",
        ".advertisement",
        ".ads",
        ".ad",
        ".social",
        ".share",
        ".newsletter",
        ".subscribe",
        ".popup",
        ".modal",
        ".overlay",
        ".breadcrumb",
        ".pagination",
        ".comments",
        ".related",
        ".recommended",
      ];
      junkSelectors.forEach((sel) => {
        document.querySelectorAll(sel).forEach((el) => el.remove());
      });

      // Find the most content-rich container
      const candidates = [
        document.querySelector("article"),
        document.querySelector("main"),
        document.querySelector("[role='main']"),
        document.querySelector(".content"),
        document.querySelector("#content"),
        document.querySelector(".post"),
        document.querySelector(".article"),
        document.body,
      ].filter(Boolean);

      const root = candidates.reduce((best, el) => {
        const len = (el.innerText || "").length;
        return len > (best?.innerText?.length || 0) ? el : best;
      }, null);

      // Extract clean paragraphs/headings/list items
      const blocks = [];
      root
        .querySelectorAll(
          "h1, h2, h3, h4, h5, h6, p, li, blockquote, pre, td, th, dd, dt",
        )
        .forEach((el) => {
          const t = (el.innerText || "").trim().replace(/\s+/g, " ");
          if (t && t.length > 1) blocks.push(t);
        });

      const fallback = (root.innerText || "").trim();
      const joined = blocks.length > 0 ? blocks.join("\n") : fallback;

      // Deduplicate consecutive identical lines
      const lines = joined.split("\n");
      const deduped = [];
      for (const line of lines) {
        if (line && line !== deduped[deduped.length - 1]) deduped.push(line);
      }

      return {
        title: document.title || "",
        text: deduped.join("\n").trim(),
      };
    });

    await browser.close();
    if (!text || text.length < 50) {
      console.error("Scraped content is empty or too short");
      return NextResponse.json(
        { error: "No meaningful content scraped" },
        { status: 500 },
      );
    }
    console.log("Storing content in Weaviate...");
    await weaviateClient.data
      .creator()
      .withClassName("WebContent")
      .withProperties({ url, text })
      .do();
    console.log("Content stored successfully");
    const wordCount = text.split(/\s+/).filter(Boolean).length;
    const chunkCount = Math.ceil(wordCount / 500);
    let websiteName = url;
    try {
      websiteName = new URL(url).hostname.replace("www.", "");
    } catch {
      /* keep url as name */
    }
    return NextResponse.json({
      message: "Scraped and stored successfully",
      text,
      title,
      websiteName,
      wordCount,
      chunkCount,
    });
  } catch (error) {
    console.error("Error scraping or storing data:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
