import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

async function testGeminiKey() {
  console.log("\n🔑 Testing Gemini API Key...\n");
  
  const apiKey = process.env.GEMINI_API_KEY;
  console.log("API Key Length:", apiKey.length);
  console.log("API Key (first 20 chars):", apiKey.substring(0, 20) + "...");
  
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "embedding-001" });
    
    console.log("⏳ Testing embedding generation...");
    const result = await model.embedContent("hello world test");
    
    console.log("✅ SUCCESS! API Key is valid!");
    console.log("Embedding generated:", result.embedding.values.length, "dimensions");
  } catch (error) {
    console.error("❌ ERROR: API Key is INVALID!");
    console.error("Error:", error.message);
    console.log("\n📌 ACTION NEEDED:");
    console.log("1. Go to: https://aistudio.google.com/apikey");
    console.log("2. Click on your API key to see FULL details");
    console.log("3. Make sure you copy the ENTIRE key (it should be 40+ characters)");
    console.log("4. Replace it in Backend/.env line 20");
    console.log("5. Run this test again");
  }
}

testGeminiKey();
