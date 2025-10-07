import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import asyncHandler from "../utils/asyncHandler.js"
import {uploadCloudinary} from "../utils/cloudinary.js"
import { v2 as cloudinary } from "cloudinary";



const getAllVideos = asyncHandler(async (req, res) => {
    // 1. Get all the options from the URL's query parameters
    const { page = 1, limit = 9, query, sortBy, sortType, userId } = req.query;

    // 2. Create an empty object for the main filter condition ($match)
    const matchStage = {};

    // 3. If a search query is provided, add a $text search to the filter
    //    (This requires the text index we created in the Video model)
    if (query) {
        matchStage.$text = { $search: query };
    }

    // 4. If a userId is provided, add a filter to only find videos by that user
    if (userId) {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
             throw new ApiError(400, "Invalid userId format");
        }
        matchStage.owner = new mongoose.Types.ObjectId(userId);
    }
    
    // 5. Always ensure we only get videos that are marked as published
    matchStage.isPublished = true;

    // 6. Create the main aggregation pipeline array, starting with our filter
    const pipeline = [
        { $match: matchStage }
    ];

    // 7. Create a sort stage. Default to newest videos first if not specified.
    const sortStage = {};
    if (sortBy && sortType) {
        sortStage[sortBy] = sortType === 'desc' ? -1 : 1;
    } else {
        sortStage.createdAt = -1;
    }
    
    // 8. Add other stages to the pipeline: lookup owner details and then sort
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
        { $project: { ownerDetails: 0 } },
        { $sort: sortStage }
    );

    // 9. Set up the options for pagination
    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 9)
    };

    // 10. Execute the aggregation pipeline with pagination
    const videos = await Video.aggregatePaginate(pipeline, options);

    // 11. Return the paginated data as the final response
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
    const { videoId } = req.params
    if(!videoId){
        throw new ApiError(400 , "videoId is required")
    }

    const video = await Video.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(videoId)
            }
        },
        {
            // Get the owner's details from the 'users' collection
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "ownerDetails",
                pipeline: [
                    {
                        // Only select the username and avatar from the owner's details
                        $project: {
                            username: 1,
                            avatar: 1
                        }
                    }
                ]
            }
        },
        {
            // Clean up the ownerDetails field
            $addFields: {
                owner: {
                    $first: "$ownerDetails"
                }
            }
        }
    ]);
    if( video.length === 0){
        throw new ApiError(404, "video is not found")
    }
    return res
    .status(200)
    .json(new ApiResponse(
        200,
        video,
        "Video fatched successfully"
    ))
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params 
    if(!videoId){
        throw new ApiError(400 , "videoId is required")
    }

    const {title , discription} = req.body;
    if(!title || !discription){
        throw new ApiError(400 , "title and discription required")
    }

    const thumbnailPath = await req.file?.path;
    if(!thumbnailPath){
        throw new ApiError(400 , "thumbnail is required")
    }

    const oldVideo = await Video.findById(videoId);
    if (!oldVideo) {
        throw new ApiError(404, "Video not found");
    }
    const oldThumbnailUrl = oldVideo.thumbnail;

    if (oldVideo.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this video");
    }
    
    const thumbnail = await uploadCloudinary(thumbnailPath)
    if(!thumbnail?.url){
        throw new ApiError(500 , "Error in uploading the thumbnail on cloudinary")
    }

    const updateVideo = Video.findByIdAndUpdate(videoId)(
        videoId,
        {
            $set: {
                title,
                discription,
                thumbnail: thumbnail.url
            } 
        },
         {new: true}
    )

    if(oldThumbnailUrl){
        try {
            const publicId = oldThumbnailUrl.split("/").pop().split(".")[0];
            if (publicId) {
                await cloudinary.uploader.destroy(publicId);
            }
        } catch (error) {
            console.error("Failed to delete the old thumbnail from Cloudinary:", error);
        }
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            updateVideo,
            "Video details updated successfully"
        )
    )
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


const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const userId = req.user._id;

    if (!videoId )  {
        throw new ApiError(400, "Invalid videoId");
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    // --- Main Toggle Logic ---

    // First, remove the user from the dislikes array if they are in it
    video.dislikes.pull(userId);

    // Now, check if the user has already liked the video
    const isLiked = video.likes.includes(userId);

    if (isLiked) {
        // User has already liked it, so we remove the like
        video.likes.pull(userId);
    } else {
        // User has not liked it, so we add the like
        video.likes.push(userId);
    }

    // Save the changes to the database
    await video.save({ validateBeforeSave: false });

    return res
        .status(200)
        .json(new ApiResponse(200, { isLiked: !isLiked }, "Like status toggled successfully"));
});

const toggleVideoDislike = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const userId = req.user._id;

    if (!videoId )  {
        throw new ApiError(400, "Invalid videoId");
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found");
    }
    // --- Main Toggle Logic ---

    // First, remove the user from the likes array if they are in it
    video.likes.pull(userId);

    // Now, check if the user has already disliked the video
    const isDisliked = video.dislikes.includes(userId);
    if (isDisliked) {
        video.dislikes.pull(userId);
    }
    else {
        video.dislikes.push(userId);
    }

    // Save the changes to the database
    await video.save({ validateBeforeSave: false });

    return res
        .status(200)
        .json(new ApiResponse(200, { isDisliked: !isDisliked }, "Dislike status toggled successfully"));

});


export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus,
    toggleVideoLike,
    toggleVideoDislike
}