import mongoose from "mongoose";
import { config } from "dotenv";
import { Video } from "./src/models/video.model.js";

config();

const checkEmbeddings = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ Connected to MongoDB");

        // Check if videos have embeddings
        const videoWithEmbed = await Video.findOne({embedding: {$exists: true}});
        
        if (videoWithEmbed) {
            console.log("\n✅ Found video with embedding:");
            console.log("   Title:", videoWithEmbed.title);
            console.log("   Embedding length:", videoWithEmbed.embedding.length);
            console.log("   First 10 values:", videoWithEmbed.embedding.slice(0, 10));
        } else {
            console.log("\n❌ No videos with embeddings found");
        }

        process.exit(0);
    } catch (error) {
        console.error("Error:", error.message);
        process.exit(1);
    }
};

checkEmbeddings();
