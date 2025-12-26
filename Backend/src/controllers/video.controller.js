import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import asyncHandler from "../utils/asyncHandler.js"
import {uploadCloudinary} from "../utils/cloudinary.js"
import { v2 as cloudinary } from "cloudinary";
import { generateEmbedding, generateAndSaveVideoEmbedding } from "../services/search.service.js";


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 9, query, sortBy, sortType, userId, isShort } = req.query;

    const matchStage = {};

    if (query) {
        matchStage.$text = { $search: query };
    }

    if (isShort !== undefined) {
        if (isShort === 'true') {
            matchStage.isShort = true;
        } else {
            // Match videos where isShort is false OR does not exist (for old videos)
            matchStage.isShort = { $ne: true };
        }
    }

    if (userId) {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
             throw new ApiError(400, "Invalid userId format");
        }
        matchStage.owner = new mongoose.Types.ObjectId(userId);
    }
    
    matchStage.isPublished = true;

    // 1. Create the pipeline and add the initial filter
    const pipeline = [
        { $match: matchStage }
    ];

    // 2. Create and add the SORT stage *BEFORE* the lookup
    const sortStage = {};
    if (sortBy && sortType) {
        sortStage[sortBy] = sortType === 'desc' ? -1 : 1;
    } else {
        sortStage.createdAt = -1;
    }
    pipeline.push({ $sort: sortStage });
    
    // 3. NOW, add the stages to lookup and shape the owner data
    pipeline.push(
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "ownerDetails",
                pipeline: [{ $project: { username: 1, avatar: 1 } }]
            }
        },
        { $addFields: { owner: { $first: "$ownerDetails" } } },
        { $project: { ownerDetails: 0 } }
    );

    // 4. Set up the options for pagination (Corrected typo from 9 to 10)
    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10) 
    };

    // 5. Execute the pipeline
    const videos = await Video.aggregatePaginate(pipeline, options);

    return res
        .status(200)
        .json(new ApiResponse(200, videos, "Videos fetched successfully"));
});


const publishAVideo = asyncHandler(async (req, res) => {
    try {
        console.log("Publishing video - Body:", req.body);
        console.log("Publishing video - Files:", req.files);
        console.log("Publishing video - User:", req.user);

        // Step 1: Get title and description from the request body
        const { title, discription, isShort } = req.body;

        // Step 2: Validate that title is not empty
        if (!title || title.trim() === "") {
            throw new ApiError(400, "Title is required and cannot be empty");
        }

        // Step 3: Get the local paths
        const videoFileLocalPath = req.files?.videoFile?.[0]?.path;
        const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

        if (!videoFileLocalPath) {
            console.error("Upload Error: No video file found in req.files", req.files);
            throw new ApiError(400, "Video file is required. Please select a valid video.");
        }

        // Use absolute path for Cloudinary upload
        const path = await import('path');
        const absoluteVideoPath = path.resolve(videoFileLocalPath);
        console.log("Absolute video path:", absoluteVideoPath);

        // Step 5: Upload video to Cloudinary
        const videoFile = await uploadCloudinary(absoluteVideoPath);
        
        if (!videoFile) {
            throw new ApiError(500, "Failed to upload video to Cloudinary. Check backend logs.");
        }

        const videoUrl = videoFile.secure_url || videoFile.url;
        if (!videoUrl) {
            throw new ApiError(500, "Cloudinary did not return a URL. Check backend logs.");
        }

        // Step 6: Handle thumbnail (upload if exists, otherwise use default)
        let thumbnailUrl = "https://res.cloudinary.com/dq1qndzmn/image/upload/v1710000000/default_thumb.jpg"; // Default thumbnail
        if (thumbnailLocalPath) {
            const absoluteThumbPath = path.resolve(thumbnailLocalPath);
            const thumbnail = await uploadCloudinary(absoluteThumbPath);
            if (thumbnail?.secure_url || thumbnail?.url) {
                thumbnailUrl = thumbnail.secure_url || thumbnail.url;
            }
        }

        // Step 7: Create a new video document in the database
        const video = await Video.create({
            title,
            discription: discription || "No description",
            videoFile: videoUrl,
            thumbnail: thumbnailUrl,
            duration: videoFile.duration || 0, 
            owner: req.user?._id,
            isShort: isShort === 'true' || isShort === true
        });

        // Step 7.5: Generate and save embedding for RAG semantic search
        // This converts video content to vector for efficient semantic search
        try {
            console.log(`⏳ Generating embedding for video: "${title}"`);
            
            // Generate embedding from all video content
            const embedding = await generateAndSaveVideoEmbedding(video);
            
            // Save embedding to database (for instant search later!)
            video.embedding = embedding;
            await video.save();
            
            console.log(`✅ Video "${title}" is now indexed for semantic search!`);
        } catch (embeddingError) {
            console.error("⚠️ Embedding generation failed (non-critical):", embeddingError.message);
            // Continue even if embedding fails - video is still created
            // Just won't appear in semantic search results until embedding is available
        }

        // Cleanup local files after DB success
        const fs = await import('fs');
        try {
            if (fs.existsSync(absoluteVideoPath)) fs.unlinkSync(absoluteVideoPath);
            if (thumbnailLocalPath && fs.existsSync(path.resolve(thumbnailLocalPath))) {
                fs.unlinkSync(path.resolve(thumbnailLocalPath));
            }
        } catch (cleanupError) {
            console.error("Cleanup Error (non-fatal):", cleanupError);
        }

        // Step 8: Send a success response with the created video data
        return res.status(201).json(
            new ApiResponse(201, video, "Video published successfully")
        );
    } catch (error) {
        console.error("CRITICAL UPLOAD ERROR:", error);
        throw error; // Re-throw to be caught by asyncHandler/global error handler
    }
});


const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    const video = await Video.aggregate([
        {
            $match: { _id: new mongoose.Types.ObjectId(videoId) }
        },
        {
            $lookup: { from: "subscriptions", localField: "owner", foreignField: "channel", as: "subscribers" }
        },
        {
            $lookup: {
                from: "subscriptions",
                let: { videoOwnerId: "$owner" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ["$channel", "$$videoOwnerId"] },
                                    { $eq: ["$subscriber", new mongoose.Types.ObjectId(req.user?._id)] }
                                ]
                            }
                        }
                    }
                ],
                as: "currentUserSubscription"
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "ownerDetails",
                pipeline: [
                    { $project: { username: 1, avatar: 1 } }
                ]
            }
        },
        // --- THIS STAGE IS NOW CORRECTED ---
        {
            $addFields: {
                owner: {
                    // Merge the fields from ownerDetails with the calculated fields
                    $mergeObjects: [
                        { $first: "$ownerDetails" },
                        {
                            subscribersCount: { $size: "$subscribers" },
                            isSubscribed: {
                                $cond: {
                                    if: { $gt: [{ $size: "$currentUserSubscription" }, 0] },
                                    then: true,
                                    else: false
                                }
                            }
                        }
                    ]
                }
            }
        },
        {
            $project: {
                ownerDetails: 0,
                subscribers: 0,
                currentUserSubscription: 0
            }
        }
    ]);

    if (video.length === 0) {
        throw new ApiError(404, "Video not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, video[0], "Video fetched successfully"));
});


const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { title, discription } = req.body;

    if (!videoId) {
        throw new ApiError(400, "videoId is required");
    }
    if (!title && !discription) {
        throw new ApiError(400, "At least one field (title or description) is required to update");
    }

    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }
    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this video");
    }
    const thumbnailPublicId = await video.thumbnail.split("/").pop().split(".")[0];

    const thumbnailLocalPath = req.file?.path;
    let newThumbnailUrl = video.thumbnail; 

    if (thumbnailLocalPath) {
        const newThumbnail = await uploadCloudinary(thumbnailLocalPath);
        if (!newThumbnail?.url) {
            throw new ApiError(500, "Error uploading new thumbnail");
        }
        newThumbnailUrl = newThumbnail.url;
        
        // After successfully uploading the new one, delete the old one
        if (video.thumbnail) {
            await cloudinary.uploader.destroy(thumbnailPublicId)
        }
    }

    
    const updatedVideo = await Video.findByIdAndUpdate(
        videoId,
        {
            $set: {
                title: title || video.title, 
                discription: discription || video.discription,
                thumbnail: newThumbnailUrl,
            }
        },
        { new: true }
    );

    if (!updatedVideo) {
        throw new ApiError(500, "Failed to update video details in the database");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                updatedVideo,
                "Video details updated successfully"
            )
        );
});


const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if(!videoId){
        throw new ApiError(400 , "videoId is required")
    }

    const video  = await Video.findById(videoId)

    if(!video){
        throw new ApiError(404, "video not found")
    }

    // check if the user is the owner of video or not 
    if(video.owner.toString() !== req.user._id.toString()){
        throw new ApiError(403, "You are not authorized to delete this video")
    }

    const videoPulicId = await video.videoFile.split("/").pop().split(".")[0];
    const thumbnailPublicId = await video.thumbnail.split("/").pop().split(".")[0];

    if(videoPulicId){
        await cloudinary.uploader.destroy(videoPulicId , {resource_type: "video"})
    }
    if(thumbnailPublicId){
        await cloudinary.uploader.destroy(thumbnailPublicId)
    }

    await Video.findByIdAndDelete(videoId)

     return res
        .status(200)
        .json(new ApiResponse(200, {}, "Video deleted successfully"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    const video  = await Video.findById(videoId);
    if(!video){
        throw new ApiError(404, "Video not found")
    }

    video.isPublished  = !video.isPublished;
    await video.save({validateBeforeSave: false})

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        { isPublished: video.isPublished },
         "Publish status toggled successfully"
        )
    );    
});


const getUpNextVideos = asyncHandler(async (req, res) => {
    const { channelId, currentVideoId } = req.params;
    const limit = 15; 

    if (!mongoose.isValidObjectId(channelId) || !mongoose.isValidObjectId(currentVideoId)) {
        throw new ApiError(400, "Invalid channel or video ID");
    }

    const channelVideos = await Video.aggregate([
        {
            // 1. Find matching videos (same as Video.find)
            $match: {
                owner: new mongoose.Types.ObjectId(channelId),
                _id: { $ne: new mongoose.Types.ObjectId(currentVideoId) },
                isPublished: true,
            }
        },
        {
            // 2. Sort them
            $sort: { createdAt: -1 }
        },
        {
            // 3. This is the safe version of .populate()
            $lookup: {
                from: "users", // The name of your users collection
                localField: "owner",
                foreignField: "_id",
                as: "owner", // Put the result in a field named 'owner'
                pipeline: [
                    // Only select the fields we want from the user
                    { $project: { username: 1, avatar: 1 } }
                ]
            }
        },
        {
            // If the 'owner' array is empty (user not found), 
            // $unwind will *discard the entire video* instead of crashing.
            $unwind: "$owner"
        }
    ]);

    // 2. Determine how many more videos we need
    const remainingLimit = limit - channelVideos.length;

    let generalVideos = [];

    // 3. If we still need more videos, fetch popular ones
    if (remainingLimit > 0) {
        
        // Create a list of IDs to exclude
        const excludeIds = [
            new mongoose.Types.ObjectId(currentVideoId),
            ...channelVideos.map(video => video._id) // these are already ObjectIds from aggregate
        ];

        generalVideos = await Video.aggregate([
            {
                // 1. Find videos not in the exclude list
                $match: {
                    _id: { $nin: excludeIds },
                    isPublished: true,
                }
            },
            {
                // 2. Sort by most popular
                $sort: { views: -1, createdAt: -1 }
            },
            {
                // 3. Limit to only what we need
                $limit: remainingLimit
            },
            {
                // 4. Same safe populate
                $lookup: {
                    from: "users",
                    localField: "owner",
                    foreignField: "_id",
                    as: "owner",
                    pipeline: [
                        { $project: { username: 1, avatar: 1 } }
                    ]
                }
            },
            {
                // 5. Same safe unwind
                $unwind: "$owner"
            }
        ]);
    }

    // 4. Combine the two lists
    const upNextPlaylist = [...channelVideos, ...generalVideos];

    if (upNextPlaylist.length === 0) {
        return res
            .status(200)
            .json(new ApiResponse(200, [], "No other videos available"));
    }

    return res
        .status(200)
        .json(new ApiResponse(200, upNextPlaylist, "Up next playlist fetched successfully"));
});

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus,
    getUpNextVideos
}