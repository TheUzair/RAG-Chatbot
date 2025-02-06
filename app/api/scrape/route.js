import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium-min";
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
    const puppeteerConfig = {
      args: [...chromium.args, "--no-sandbox", "--disable-setuid-sandbox"],
      headless: chromium.headless,
    };

    if (process.env.VERCEL) {
      console.log("Running on Vercel with @sparticuz/chromium-min");
      puppeteerConfig.executablePath = await chromium.executablePath() || "/usr/bin/chromium";
    } else {
      console.log("Running locally with Chrome");
      puppeteerConfig.executablePath =
        process.env.PUPPETEER_EXECUTABLE_PATH ||
        "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
    }

    browser = await puppeteer.launch(puppeteerConfig);
    const page = await browser.newPage();

    await page.goto(url, {
      waitUntil: "networkidle2",
      timeout: 30000,
    });

    let text = await page.evaluate(() => document.body.innerText.trim());
    await browser.close();

    if (!text) {
      console.error("Scraped content is empty");
      return NextResponse.json({ error: "No meaningful content scraped" }, { status: 500 });
    }

    console.log("Storing content in Weaviate...");
    await weaviateClient.data.creator()
      .withClassName("WebContent")
      .withProperties({
        url,
        text,
        scrapedAt: new Date().toISOString(),
      })
      .do();

    console.log("Content stored successfully");
    return NextResponse.json({
      message: "Scraped and stored successfully",
      text: text.substring(0, 1000),
    });
  } catch (error) {
    console.error("Error scraping or storing data:", error.message);
    return NextResponse.json(
      {
        error: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}