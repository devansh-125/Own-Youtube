import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import asyncHandler from "../utils/asyncHandler.js"
import {uploadCloudinary} from "../utils/cloudinary.js"
import { v2 as cloudinary } from "cloudinary";



const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 9, query, sortBy, sortType, userId } = req.query;

    const matchStage = {};

    if (query) {
        matchStage.$text = { $search: query };
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
    // Step 1: Get title and description from the request body
    const { title, discription } = req.body;

    // Step 2: Validate that title and description are not empty
    if (!title || !discription) {
        throw new ApiError(400, "Title and discription are required");
    }

    // Step 3: Get the local paths for the video and thumbnail files from Multer
    const videoFileLocalPath = req.files?.videoFile?.[0]?.path;
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

    // Step 4: Validate that both files were uploaded
    if (!videoFileLocalPath) {
        throw new ApiError(400, "Video file is required");
    }
    if (!thumbnailLocalPath) {
        throw new ApiError(400, "Thumbnail is required");
    }

    // Step 5: Upload both files to Cloudinary
    const videoFile = await uploadCloudinary(videoFileLocalPath);
    const thumbnail = await uploadCloudinary(thumbnailLocalPath);

    // Step 6: Validate that the uploads were successful
    if (!videoFile?.url || !thumbnail?.url) {
        throw new ApiError(500, "Failed to upload video or thumbnail to Cloudinary");
    }

    // Step 7: Create a new video document in the database
    const video = await Video.create({
        title,
        discription,
        videoFile: videoFile.url,
        thumbnail: thumbnail.url,
        duration: videoFile.duration, // Cloudinary provides video duration
        owner: req.user._id // Get the owner from the authenticated user
    });
    // console.log(req.user.fullName);

    // Step 8: Send a success response with the created video data
    return res.status(201).json(
        new ApiResponse(201, video, "Video published successfully")
    );
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


export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}