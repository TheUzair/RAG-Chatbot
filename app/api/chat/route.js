import groqClient from "@/app/lib/groqClient";
import weaviateClient from "@/app/lib/weaviateClient";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { query } = await req.json();
    console.log("Received query:", query);
    if (!query) return NextResponse.json({ error: "Query is required" }, { status: 400 });

    const vectorResponse = await weaviateClient.graphql
      .get()
      .withClassName("WebContent")
      .withFields("_additional { vector }")
      .withLimit(1)
      .do();

    const queryVector = vectorResponse?.data?.Get?.WebContent?.[0]?._additional?.vector;

    if (!queryVector) {
      return NextResponse.json({ error: "Failed to generate vector for query" }, { status: 400 });
    }

    console.log("Generated Query Vector:", queryVector);

    const response = await weaviateClient.graphql
      .get()
      .withClassName("WebContent")
      .withFields("text url")
      .withNearVector({ vector: queryVector })
      .withLimit(1)
      .do();

    console.log("Weaviate Response:", response);

    const retrievedText = response?.data?.Get?.WebContent?.[0]?.text || "No relevant content found.";
    const sourceUrl = response?.data?.Get?.WebContent?.[0]?.url || "";

    const chatResponse = await groqClient.chat.completions.create({
      messages: [{ role: "user", content: `${retrievedText}\n\nUser query: ${query}` }],
      model: "llama3-70b-8192",
    });

    console.log("Final Groq Chat Response:", chatResponse);

    if (!chatResponse?.choices?.[0]?.message?.content) {
      return NextResponse.json({ error: "No response from model" }, { status: 500 });
    }

    const botResponse = chatResponse.choices[0].message.content;

    const finalResponse = sourceUrl
      ? `${botResponse}\n\n**Source:** [Click here](${sourceUrl})`
      : botResponse;

    return NextResponse.json({ response: finalResponse });
  } catch (error) {
    console.error("Error in chat API:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}