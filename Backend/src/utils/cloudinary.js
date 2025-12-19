import {v2 as cloudinary} from "cloudinary"
import fs from "fs"


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

const uploadCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        
        console.log("Uploading to Cloudinary:", localFilePath);
        
        if (!fs.existsSync(localFilePath)) {
            console.error("File not found before upload:", localFilePath);
            return null;
        }

        // Determine resource type based on extension
        const isVideo = localFilePath.match(/\.(mp4|mov|avi|mkv|webm)$/i);
        
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: isVideo ? "video" : "auto",
            folder: "videotube",
        })
        
        console.log("Cloudinary Response:", JSON.stringify(response, null, 2));
        
        // We will NOT unlink here to avoid the ENOENT crash during stream processing
        // The controller or a cleanup job should handle this, or we wait a bit.
        // But for now, let's just return the response.
        
        return response;

    } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        return null;
    }
}

export {uploadCloudinary}