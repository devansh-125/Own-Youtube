import mongoose from "mongoose";
import { config } from "dotenv";
import { Video } from "./src/models/video.model.js";
import { User } from "./src/models/user.model.js";
import { generateEmbedding, hybridSearch } from "./src/services/search.service.js";

config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`✅ MongoDB connected`);
        return conn;
    } catch (error) {
        console.error("❌ MongoDB connection failed:", error);
        process.exit(1);
    }
};

const testSearch = async () => {
    try {
        await connectDB();

        console.log("\n🔍 Testing Search System...\n");

        // Check total videos in database
        const totalVideos = await Video.countDocuments({ isPublished: true });
        console.log(`📊 Total published videos: ${totalVideos}`);

        // Check videos with embeddings
        const videosWithEmbeddings = await Video.countDocuments({
            isPublished: true,
            embedding: { $exists: true, $ne: null }
        });
        console.log(`📊 Videos with embeddings: ${videosWithEmbeddings}`);

        // Check videos without embeddings
        const videosWithoutEmbeddings = await Video.countDocuments({
            isPublished: true,
            embedding: { $exists: false }
        });
        console.log(`📊 Videos without embeddings: ${videosWithoutEmbeddings}\n`);

        // Test embedding generation
        const testQuery = "birthday";
        console.log(`🧪 Testing query embedding for: "${testQuery}"`);
        
        try {
            const queryEmbedding = await generateEmbedding(testQuery);
            console.log(`✅ Query embedding generated successfully`);
            console.log(`📏 Embedding vector size: ${queryEmbedding.length}`);
        } catch (error) {
            console.error(`❌ Failed to generate query embedding:`, error.message);
            throw error;
        }

        // Test hybrid search
        console.log(`\n🔎 Performing hybrid search for: "${testQuery}"\n`);
        
        try {
            const results = await hybridSearch(testQuery, 10);
            console.log(`✅ Hybrid search completed`);
            console.log(`📊 Found ${results.length} results\n`);

            if (results.length > 0) {
                console.log("Top 5 results:");
                results.slice(0, 5).forEach((video, index) => {
                    console.log(`${index + 1}. "${video.title}"`);
                    console.log(`   Duration: ${video.duration}s, Views: ${video.views}`);
                });
            } else {
                console.log("No results found");
            }
        } catch (error) {
            console.error(`❌ Hybrid search failed:`, error.message);
            throw error;
        }

        process.exit(0);

    } catch (error) {
        console.error("❌ Test Error:", error.message);
        process.exit(1);
    }
};

testSearch();
