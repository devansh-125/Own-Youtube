/**
 * Script to generate embeddings for all existing videos in the database
 * Run this once to backfill embeddings for videos uploaded before the RAG feature was implemented
 * 
 * Usage: node generateExistingVideoEmbeddings.js
 */

import dotenv from "dotenv";
import mongoose from "mongoose";
import { Video } from "./src/models/video.model.js";
import { generateAndSaveVideoEmbedding } from "./src/services/search.service.js";

dotenv.config();

async function generateEmbeddingsForExistingVideos() {
  try {
    // Connect to MongoDB
    console.log("🔗 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB connected!");

    // Find all published videos WITHOUT embeddings
    console.log("\n🔍 Finding existing videos without embeddings...");
    const videosWithoutEmbeddings = await Video.find({
      isPublished: true,
      embedding: { $exists: false }
    }).select("_id title description");

    const totalVideos = videosWithoutEmbeddings.length;
    console.log(`📊 Found ${totalVideos} videos that need embeddings\n`);

    if (totalVideos === 0) {
      console.log("✅ All existing videos already have embeddings!");
      process.exit(0);
    }

    // Process each video
    let successCount = 0;
    let failureCount = 0;

    for (let i = 0; i < totalVideos; i++) {
      const video = videosWithoutEmbeddings[i];
      const progressPercent = Math.round(((i + 1) / totalVideos) * 100);

      try {
        console.log(`[${progressPercent}%] Processing: "${video.title}"`);

        // Generate embedding
        const embedding = await generateAndSaveVideoEmbedding(video);

        // Save to database
        video.embedding = embedding;
        await video.save();

        console.log(`   ✅ Embedding generated and saved!`);
        successCount++;
      } catch (error) {
        console.error(`   ❌ Failed: ${error.message}`);
        failureCount++;
      }

      // Small delay to avoid rate limiting
      if (i < totalVideos - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    // Summary
    console.log("\n" + "=".repeat(60));
    console.log("📈 EMBEDDING GENERATION COMPLETE!");
    console.log("=".repeat(60));
    console.log(`✅ Successfully processed: ${successCount}/${totalVideos}`);
    if (failureCount > 0) {
      console.log(`❌ Failed: ${failureCount}/${totalVideos}`);
    }
    console.log(`\n🚀 All existing videos are now indexed for semantic search!`);
    console.log("💡 Tip: Your search will now work on these videos too!");

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error:", error.message);
    console.error("Stack:", error.stack);
    process.exit(1);
  }
}

// Run the script
generateEmbeddingsForExistingVideos();
