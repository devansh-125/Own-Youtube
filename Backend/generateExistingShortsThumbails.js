import { config } from "dotenv";

// Load environment variables FIRST
config();

import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import path from "path";
import fs from "fs";
import { Video } from "./src/models/video.model.js";
import { extractFrameFromVideo } from "./src/utils/generateThumbnail.js";

// Configure Cloudinary with loaded env vars
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

console.log("Cloudinary Configured with:", {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY ? "PRESENT" : "MISSING",
    api_secret: process.env.CLOUDINARY_API_SECRET ? "PRESENT" : "MISSING"
});

// Upload to Cloudinary
const uploadCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        
        console.log("Uploading to Cloudinary:", localFilePath);
        
        if (!fs.existsSync(localFilePath)) {
            console.error("File not found before upload:", localFilePath);
            return null;
        }

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
            folder: "videotube",
        })
        
        return response;

    } catch (error) {
        console.error("Cloudinary Upload Error:", error.message);
        return null;
    }
}

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

const generateMissingShortsThumbails = async () => {
    try {
        await connectDB();

        // Find all shorts with default/missing thumbnails
        const shortsWithoutThumbnails = await Video.find({
            isPublished: true,
            isShort: true,
            $or: [
                { thumbnail: { $exists: false } },
                { thumbnail: null },
                { thumbnail: "" },
                { thumbnail: /default_thumb/ }  // Also find default thumbnails
            ]
        });

        console.log(`\n🎬 Found ${shortsWithoutThumbnails.length} shorts without thumbnails\n`);

        if (shortsWithoutThumbnails.length === 0) {
            console.log("✅ All shorts already have thumbnails!");
            process.exit(0);
        }

        let successCount = 0;
        let failureCount = 0;

        for (let i = 0; i < shortsWithoutThumbnails.length; i++) {
            const video = shortsWithoutThumbnails[i];
            const progress = `[${i + 1}/${shortsWithoutThumbnails.length}]`;

            try {
                console.log(`${progress} ⏳ Processing short: "${video.title}"`);
                console.log(`   📹 Video URL: ${video.videoFile}`);

                // Extract frame from video (at 1 second)
                const frameOutputPath = await extractFrameFromVideo(video.videoFile, 1);
                console.log(`${progress} 📸 Frame extracted: ${frameOutputPath}`);

                // Wait a moment for file to be written
                await new Promise(resolve => setTimeout(resolve, 500));

                // Upload frame to Cloudinary
                console.log(`${progress} ☁️  Uploading to Cloudinary...`);
                const uploadResponse = await uploadCloudinary(frameOutputPath);

                if (!uploadResponse || !uploadResponse.secure_url) {
                    throw new Error("Cloudinary upload failed - no URL returned");
                }

                const thumbnailUrl = uploadResponse.secure_url;
                console.log(`${progress} ✅ Thumbnail uploaded: ${thumbnailUrl}`);

                // Update video in database
                video.thumbnail = thumbnailUrl;
                await video.save();

                console.log(`${progress} 💾 Database updated for: "${video.title}"\n`);
                successCount++;

                // Clean up local file
                try {
                    if (fs.existsSync(frameOutputPath)) {
                        fs.unlinkSync(frameOutputPath);
                        console.log(`${progress} 🗑️  Local frame cleaned up\n`);
                    }
                } catch (cleanupError) {
                    console.warn(`${progress} ⚠️  Warning: Could not clean up frame file: ${cleanupError.message}\n`);
                }

                // Add delay to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 1000));

            } catch (error) {
                failureCount++;
                console.error(`${progress} ❌ Failed to process short: "${video.title}"\n`, error.message, "\n");
            }
        }

        console.log(`\n📊 Summary:`);
        console.log(`   ✅ Successfully generated: ${successCount} thumbnails`);
        console.log(`   ❌ Failed: ${failureCount} thumbnails\n`);

        process.exit(0);

    } catch (error) {
        console.error("❌ Error:", error);
        process.exit(1);
    }
};

generateMissingShortsThumbails();
