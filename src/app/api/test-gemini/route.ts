// Create this as a separate test file: app/api/test-gemini/route.js
import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("=== Simple Test ===");

    // Test 1: Environment variable
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    console.log("API Key exists:", !!apiKey);
    console.log("API Key starts with:", apiKey?.substring(0, 10) + "...");

    if (!apiKey) {
      return NextResponse.json({ error: "No API key found" });
    }

    // Test 2: Simple import test
    const { google } = await import("@ai-sdk/google");
    console.log("Google SDK imported successfully");

    // Test 3: Simple AI SDK test
    const { streamText } = await import("ai");
    console.log("AI SDK imported successfully");

    // Test 4: Create model instance
    const model = google("gemini-1.5-flash");
    console.log("Model created successfully");

    // Test 5: Simple API call
    const result = await streamText({
      model: model,
      prompt: "Hello",
      maxTokens: 10,
    });

    console.log("StreamText call successful");

    return NextResponse.json({
      success: true,
      message: "All tests passed",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Test failed at:", error.message);
    console.error("Full error:", error);

    return NextResponse.json({
      error: error.message,
      stack: error.stack,
      name: error.name,
    });
  }
}
