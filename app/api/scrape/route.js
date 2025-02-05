import puppeteer from "puppeteer-core";
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

        const browser = await puppeteer.launch({
            executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
            headless: "new",
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
        });

        const page = await browser.newPage();
        await page.goto(url, { waitUntil: "networkidle2" });

        let text = await page.evaluate(() => document.body.innerText.trim());

        await browser.close();

        if (!text) {
            console.error("Scraped content is empty");
            return NextResponse.json({ error: "No meaningful content scraped" }, { status: 500 });
        }

        console.log("Storing content in Weaviate...");
        console.log(text);

        await weaviateClient.data.creator()
            .withClassName("WebContent")
            .withProperties({ url, text })
            .do();

        console.log("Content stored successfully");
        return NextResponse.json({ message: "Scraped and stored successfully", text });
    } catch (error) {
        console.error("Error scraping or storing data:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}