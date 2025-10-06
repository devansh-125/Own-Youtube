import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import asyncHandler from "../utils/asyncHandler.js"
import {uploadCloudinary} from "../utils/cloudinary.js"
import { v2 as cloudinary } from "cloudinary";

const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
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
    return req
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

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}