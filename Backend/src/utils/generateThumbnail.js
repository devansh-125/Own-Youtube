import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import fs from 'fs';
import os from 'os';

/**
 * Extract a frame from a video at a specific timestamp
 * @param {string} videoPath - Path to the video file
 * @param {number} timestampSeconds - Timestamp in seconds (default: 1 second)
 * @returns {Promise<string>} - Path to the extracted frame image
 */
export const extractFrameFromVideo = (videoPath, timestampSeconds = 1) => {
    return new Promise((resolve, reject) => {
        // Create a temporary file for the frame
        const tempDir = os.tmpdir();
        const frameFilename = `frame_${Date.now()}.png`;
        const frameOutputPath = path.join(tempDir, frameFilename);

        try {
            ffmpeg(videoPath)
                .on('end', () => {
                    console.log(`✅ Frame extracted successfully: ${frameOutputPath}`);
                    resolve(frameOutputPath);
                })
                .on('error', (err) => {
                    console.error('❌ Error extracting frame:', err.message);
                    reject(new Error(`Failed to extract frame: ${err.message}`));
                })
                .screenshots({
                    count: 1,
                    timestamps: [timestampSeconds],
                    filename: frameFilename,
                    folder: tempDir,
                    size: '320x540' // Shorts aspect ratio (9:16)
                });
        } catch (error) {
            reject(new Error(`Failed to setup ffmpeg: ${error.message}`));
        }
    });
};

/**
 * Extract multiple frames from a video for better thumbnail selection
 * @param {string} videoPath - Path to the video file
 * @param {number} count - Number of frames to extract (default: 3)
 * @returns {Promise<string[]>} - Array of paths to extracted frames
 */
export const extractMultipleFrames = (videoPath, count = 3) => {
    return new Promise((resolve, reject) => {
        const tempDir = os.tmpdir();
        const timestamps = [];
        
        // Generate timestamps evenly distributed through the video
        // First frame at 1 second, then equally spaced
        for (let i = 0; i < count; i++) {
            timestamps.push(1 + (i * 2)); // 1s, 3s, 5s, etc.
        }

        const frameFilename = `frame_${Date.now()}_%i.png`;
        const frameOutputPath = path.join(tempDir, frameFilename);
        const extractedFrames = [];

        try {
            ffmpeg(videoPath)
                .on('end', () => {
                    // Get the extracted frame files
                    const files = fs.readdirSync(tempDir).filter(f => 
                        f.startsWith(`frame_${Date.now()}`)
                    );
                    
                    files.forEach((file, index) => {
                        extractedFrames.push(path.join(tempDir, file));
                    });
                    
                    console.log(`✅ ${extractedFrames.length} frames extracted successfully`);
                    resolve(extractedFrames);
                })
                .on('error', (err) => {
                    console.error('❌ Error extracting frames:', err.message);
                    reject(new Error(`Failed to extract frames: ${err.message}`));
                })
                .screenshots({
                    count: count,
                    timestamps: timestamps,
                    filename: frameFilename,
                    folder: tempDir,
                    size: '320x540' // Shorts aspect ratio (9:16)
                });
        } catch (error) {
            reject(new Error(`Failed to setup ffmpeg: ${error.message}`));
        }
    });
};

/**
 * Extract frame at specific percentage of video duration
 * @param {string} videoPath - Path to the video file
 * @param {number} percentage - Percentage of video (0-100)
 * @returns {Promise<string>} - Path to the extracted frame image
 */
export const extractFrameAtPercentage = (videoPath, percentage = 25) => {
    return new Promise((resolve, reject) => {
        try {
            ffmpeg.ffprobe(videoPath, (err, metadata) => {
                if (err) {
                    return reject(new Error(`Failed to get video metadata: ${err.message}`));
                }

                const duration = metadata.format.duration;
                const timestampSeconds = (percentage / 100) * duration;

                extractFrameFromVideo(videoPath, timestampSeconds)
                    .then(resolve)
                    .catch(reject);
            });
        } catch (error) {
            reject(new Error(`Failed to process video: ${error.message}`));
        }
    });
};

export default {
    extractFrameFromVideo,
    extractMultipleFrames,
    extractFrameAtPercentage
};
