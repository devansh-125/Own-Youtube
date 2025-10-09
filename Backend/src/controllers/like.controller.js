import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import asyncHandler from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js";
import { Comment } from "../models/comment.model.js"

const getLikedVideos = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const likedVideos = await Video.aggregate([
        {
            // 1. Find all videos where the current user's ID is in the 'likes' array
            $match: {
                likes: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            // 2. Join with the 'users' collection to get the owner's details for each video
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "ownerDetails",
                pipeline: [
                    {
                        // Only get the fields we need
                        $project: {
                            username: 1,
                            avatar: 1,
                            fullName: 1
                        }
                    }
                ]
            }
        },
        {
            // 3. Deconstruct the ownerDetails array to make it an object
            $addFields: {
                owner: {
                    $first: "$ownerDetails"
                }
            }
        },
        {
            // 4. Clean up the temporary ownerDetails field
            $project: {
                ownerDetails: 0
            }
        }
    ]);
    
    return res
        .status(200)
        .json(new ApiResponse(200, likedVideos, "Liked videos fetched successfully"));
})

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


const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params;
    const userId = req.user._id;

    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid Comment ID");
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    // Check if the user has already liked this comment
    const existingLike = await Like.findOne({
        comment: commentId,
        likedBy: userId
    });

    if (existingLike) {
        // If like exists, remove it
        await Like.findByIdAndDelete(existingLike._id);
        return res.status(200).json(new ApiResponse(200, { isLiked: false }, "Comment unliked successfully"));
    } else {
        // If like does not exist, create it
        await Like.create({
            comment: commentId,
            likedBy: userId
        });
        return res.status(200).json(new ApiResponse(200, { isLiked: true }, "Comment liked successfully"));
    }
});

export {
    toggleCommentLike,
    toggleVideoLike,
    getLikedVideos,
    toggleVideoDislike
}