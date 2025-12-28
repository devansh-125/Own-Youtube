import mongoose from "mongoose";
import { config } from "dotenv";
import { Video } from "./src/models/video.model.js";
import { generateAndSaveVideoEmbedding } from "./src/services/search.service.js";

config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`✅ MongoDB connected: ${conn.connection.host}`);
        return conn;
    } catch (error) {
        console.error("❌ MongoDB connection failed:", error);
        process.exit(1);
    }
};

const generateMissingEmbeddings = async () => {
    try {
        await connectDB();

        // Find all published videos without embeddings
        const videosWithoutEmbeddings = await Video.find({
            isPublished: true,
            embedding: { $exists: false }
        });

        console.log(`\n📊 Found ${videosWithoutEmbeddings.length} videos without embeddings\n`);

        if (videosWithoutEmbeddings.length === 0) {
            console.log("✅ All videos already have embeddings!");
            process.exit(0);
        }

        let successCount = 0;
        let failureCount = 0;

        for (let i = 0; i < videosWithoutEmbeddings.length; i++) {
            const video = videosWithoutEmbeddings[i];
            const progress = `[${i + 1}/${videosWithoutEmbeddings.length}]`;

            try {
                console.log(`${progress} ⏳ Generating embedding for: "${video.title}"`);

                // Generate embedding
                const embedding = await generateAndSaveVideoEmbedding(video);

                // Save to database
                video.embedding = embedding;
                await video.save();

                successCount++;
                console.log(`${progress} ✅ Embedding saved for: "${video.title}"\n`);

                // Add a small delay to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 500));

            } catch (error) {
                failureCount++;
                console.error(`${progress} ❌ Failed to generate embedding for: "${video.title}"\n`, error.message, "\n");
            }
        }

        console.log(`\n📈 Summary:`);
        console.log(`   ✅ Successfully generated: ${successCount} embeddings`);
        console.log(`   ❌ Failed: ${failureCount} embeddings\n`);

        process.exit(0);

    } catch (error) {
        console.error("❌ Error:", error);
        process.exit(1);
    }
};

generateMissingEmbeddings();
