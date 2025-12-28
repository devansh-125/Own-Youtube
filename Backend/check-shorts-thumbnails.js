import mongoose from "mongoose";
import { config } from "dotenv";
import { Video } from "./src/models/video.model.js";

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

const checkShortsThumbails = async () => {
    try {
        await connectDB();

        // Find all shorts
        const allShorts = await Video.find({
            isPublished: true,
            isShort: true
        }).select('title thumbnail videoFile isShort');

        console.log(`\n📊 Total Shorts: ${allShorts.length}\n`);

        allShorts.forEach((short, index) => {
            console.log(`${index + 1}. Title: ${short.title}`);
            console.log(`   Thumbnail: ${short.thumbnail ? '✅ Present' : '❌ Missing'}`);
            if (short.thumbnail) {
                console.log(`   URL: ${short.thumbnail}`);
            }
            console.log('');
        });

        process.exit(0);

    } catch (error) {
        console.error("❌ Error:", error);
        process.exit(1);
    }
};

checkShortsThumbails();
