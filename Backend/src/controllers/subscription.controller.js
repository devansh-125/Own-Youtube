import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import  asyncHandler  from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    const userId = req.user._id;

    const existingSubscription = await Subscription.findOne({
        subscriber: userId,
        channel: channelId,
    });

    let isNowSubscribed;

    if (existingSubscription) {
        // User is subscribed, so unsubscribe them
        await Subscription.findByIdAndDelete(existingSubscription._id);
        isNowSubscribed = false;
    } else {
        // User is not subscribed, so subscribe them
        await Subscription.create({
            subscriber: userId,
            channel: channelId,
        });
        isNowSubscribed = true;
    }

    // After the action, get the new total count of subscribers
    const newSubscribersCount = await Subscription.countDocuments({ channel: channelId });

    // Return the new, true state to the frontend
    return res.status(200).json(
        new ApiResponse(200, {
            subscribed: isNowSubscribed,
            subscribersCount: newSubscribersCount
        }, "Subscription status updated successfully")
    );
});


// This function returns all the channels that a specific user has subscribed to.
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params;

    if (!mongoose.isValidObjectId(subscriberId)) {
        throw new ApiError(400, "Invalid subscriber ID");
    }

    const subscribedChannels = await Subscription.aggregate([
        {
            // 1. Find all subscription documents where the subscriber matches the given ID
            $match: {
                subscriber: new mongoose.Types.ObjectId(subscriberId)
            }
        },
        {
            // 2. Fetch the details of the 'channel' (the user being subscribed to)
            $lookup: {
                from: "users",
                localField: "channel",
                foreignField: "_id",
                as: "subscribedChannel"
            }
        },
        {
            // 3. Reshape the data for a clean output
            $project: {
                // We take the first element from the 'subscribedChannel' array
                subscribedChannel: {
                    $arrayElemAt: [
                        {
                            $map: {
                                input: "$subscribedChannel",
                                as: "channel",
                                in: {
                                    _id: "$$channel._id",
                                    username: "$$channel.username",
                                    fullName: "$$channel.fullName",
                                    avatar: "$$channel.avatar"
                                }
                            }
                        },
                        0
                    ]
                }
            }
        }
    ]);

    return res
        .status(200)
        .json(new ApiResponse(200, subscribedChannels, "Subscribed channels fetched successfully"));
});


// in subscription.controller.js
const getSubscriptionStatus = asyncHandler(async (req, res) => {
  const subscriberId = req.user?._id;
  const { channelId } = req.params;

  if (!mongoose.isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channel ID");
  }

  // if user not authenticated (should be captured by verifyAuth but safe-check)
  if (!subscriberId) {
    return res.status(200).json(new ApiResponse(200, { isSubscribed: false }, "Unauthenticated user"));
  }

  const existing = await Subscription.findOne({
    subscriber: subscriberId,
    channel: channelId
  });

  return res
    .status(200)
    .json(new ApiResponse(200, { isSubscribed: !!existing }, "Subscription status fetched"));
});


export { 
    toggleSubscription,
    getSubscribedChannels ,
    getSubscriptionStatus
};

