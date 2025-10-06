import asyncHandler from "../utils/asyncHandler.js"

import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import { uploadCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"
import mongoose from "mongoose"

// import {unlinkSync} from "fs"

const generateAccessTokenAndrefreshToken = async(userId)=>{
    try {
        const userToken =  await User.findById(userId)
        const accessToken = await userToken.generateAccessToken()
        const refreshToken = await userToken.generateRefreshToken()
         
        userToken.refreshToken = refreshToken
         await  userToken.save({validateBeforeSave : false} ) 
         
        return {accessToken, refreshToken}
        
    } catch (error) {
        throw new ApiError(500, error?.message || "Something went wrong with generating refresh and access tokens")
    }
}


const registerUser = asyncHandler( async(req,res) =>{
   // get datails from frontend 
   // validation - not empty
   // check if user already exits: username, email
   // check for images, check for avatar
   // upload them on cloudinary, avatar
   // create user object , create entry on db 
   // remove password and refesh token field from response
   // check for user creation 
   // return response

   const {fullName, email , username , password} =req.body
   console.log("Email: ",email);
   
   if(
    [fullName,username,email,password].some((field) => 
        field?.trim() === "" )
   ){
    throw new ApiError(409, "All field are required ")
   } 

   const existedUser = await User.findOne({
    $or: [{username},{email}]
   })
   if(existedUser){
    throw new ApiError(409, "User with email and username is already exits ")
   }
   
   const avatarLocalPath = req.files?.avatar[0]?.path;

//    const coverImageLocalPath = req.files?.coverImage[0]?.path;

   let coverImageLocalPath;
   if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0){
    coverImageLocalPath = req.files?.coverImage[0]?.path
   }

   if(!avatarLocalPath){  
    throw new ApiError(400, "Avatar file required for your server")
   }


  const avatar = await  uploadCloudinary(avatarLocalPath);
  const coverImage = await  uploadCloudinary(coverImageLocalPath);

  if(!avatar){
    throw new ApiError(500, "Avatar file required for cloudinary" )

  }

   const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase( )
  })

   const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
   )
   if(!createdUser){
    throw new ApiError(500, "User is not created in db")
   }

   return res.status(201).json(
    new ApiResponse(200, createdUser, "User register successfully")
   )    

});


const loginUser = asyncHandler(async (req,res) =>{
    // req.body data
    // username or email
    // find the user 
    // check password 
    // accessToken and refreshToken
    // send cookie

    const {email, username, password} = req.body

    if(!username && !email){
        throw new ApiError(400,"username or eamil is required for login ")
    }
    const foundUser = await User.findOne({
        $or: [{username},{email}]
    })

   if(!foundUser){
    throw new ApiError(404, "User does not exits")
   }

   const isPasswordValid = await foundUser.isPasswordCorrect(password)

   if(!isPasswordValid){
    throw new ApiError(401, "Invalid User Crendentials")
   }
   
   const {accessToken,refreshToken} = await  generateAccessTokenAndrefreshToken(foundUser._id)

     const options = {
        httpOnly: true,
        secure: true
    }
    const loggedInUser = await User.findById(foundUser._id).select("-password -refreshToken")

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                foundUser: loggedInUser, accessToken, refreshToken
            },
            "User logged In Successfully"
        )
    )

});


const logoutUser = asyncHandler(async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))
});


const refreshAccessToken = asyncHandler(async (req , res) =>{
    const incommingRefreshToken =  req.cookies.refreshToken || req.body.refreshToken

    if(!incommingRefreshToken){
        throw new ApiError(401, "Unauthorised request")
    }

    try {
        const decodedToken =  jwt.verify(
            incommingRefreshToken, 
            process.env.REFRESH_TOKEN_SECRET 
        )
        const user  = await User.findById(decodedToken._id) 
    
        if(!user){
            throw new ApiError(401, "Invalid refresh token")
        }
    
        if(incommingRefreshToken !== user?.refreshToken){
            throw new ApiError(401, "Refresh token expired or used")
        }
    
        const {accessToken , newrefreshToken} = await generateAccessTokenAndrefreshToken(user._id)
    
        const options ={
            httpOnly: true,
            secure: true
        }
    
        return res
        .status(200)
        .cookie("accessToken" , accessToken , options )
        .cookie("refreshToken" , newrefreshToken, options)
        .json(
            new ApiResponse(
                200, 
                {accessToken , refreshToken: newrefreshToken},
                "Access token refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token " )
        
    }
});


const changeCurrentPassword = asyncHandler( async(req , res) => {

    const {oldpassword,  newpassword} = req.body
    const user =  await User.findById(req?.user._id)
    const isPasswordCorrect  =  await user.isPasswordCorrect(oldpassword)
    
    if(!isPasswordCorrect){
        throw new ApiError(400, "Invalid Password")
    }
    user.password = newpassword
    await user.save({validateBeforeSave: false})

    return res
    .status(200)
    .json(new ApiResponse(200 ,{} , "Password Change Successfully"))
});


const getCurrentUser = asyncHandler( async (req, res)=>{
    return res
    .status(200)
    .json(new ApiResponse(200, req.user , "current user fetched successfully "))
});


const updateAccountDetails = asyncHandler(async(req, res) => {
    const {fullName, email} = req.body

    if (!fullName || !email) {
        throw new ApiError(400, "All fields are required")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullName,
                email
            }
        },
        {new: true}
        
    ).select("-password")

    return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"))
});



const updateUserAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path;
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is missing");
    }

    // Step 1: Get the old avatar's URL BEFORE updating
    // We need this reference to delete it later
    const oldAvatarUrl = req.user?.avatar;

    // Step 2: Upload the new file to Cloudinary
    const avatar = await uploadCloudinary(avatarLocalPath);
    if (!avatar?.url) {
        throw new ApiError(500, "Error while uploading new avatar on Cloudinary");
    }

    // Step 3: Update the user's avatar field in the database with the new URL
    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                avatar: avatar.url // Set the new avatar URL
            }
        },
        { new: true } // This option returns the updated document
    ).select("-password");

    // Step 4: After a successful update, delete the old avatar from Cloudinary
    if (oldAvatarUrl) {
        try {
            // Extract the public_id from the full URL. 
            // Example URL: http://res.cloudinary.com/demo/image/upload/v1234/folder/sample.jpg
            // We need to extract "folder/sample"
            const publicId = oldAvatarUrl.split('/').pop().split('.')[0];
            
            if (publicId) {
                // Use Cloudinary's destroy method to delete the old image
                await cloudinary.uploader.destroy(publicId);
            }
            // console.log("old file delete successfully")
        } catch (error) {
            // Log an error if deletion fails, but don't fail the entire request
            // because the user's avatar was successfully updated.
            console.error("Failed to delete the old avatar from Cloudinary:", error);
        }
    }

    // Step 5: Send the successful response back to the client
    return res
        .status(200)
        .json(
            new ApiResponse(200, user, "Avatar image updated successfully")
        );
});


import { v2 as cloudinary } from "cloudinary";

const updateUserCoverImage = asyncHandler(async (req, res) => {
    const coverImageLocalPath = req.file?.path;
    if (!coverImageLocalPath) {
        throw new ApiError(400, "Cover image file is missing");
    }

    const oldCoverImageUrl = req.user?.coverImage;

    const coverImage = await uploadCloudinary(coverImageLocalPath);
    if (!coverImage?.url) {
        throw new ApiError(500, "Error while uploading cover image to Cloudinary");
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                coverImage: coverImage.url
            }
        },
        { new: true }
    ).select("-password");

    if (oldCoverImageUrl) {
        try {
            const publicId = oldCoverImageUrl.split('/').pop().split('.')[0];
            if (publicId) {
                await cloudinary.uploader.destroy(publicId);
            }
        } catch (error) {
            console.error("Failed to delete the old cover image from Cloudinary:", error);
        }
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, user, "Cover image updated successfully")
        );
});



const getUserChannelProfile = asyncHandler( async(req,res) => {
    const {username} = req.params

    if(!username?.trim()){
        throw new ApiError(400, "username is missing")
    }

    const channel = await User.aggregate([
        {
            $match: {
                username: username?.toLowerCase()
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }

        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as : "subscribedTo"
            }
        },
        {
            $addFields: {
                subscribersCount: {
                    $size: "$subscribers"
                },
                channelsSubscribedToCount: {
                    $size: "$subscribedTo"
                },
                isSubscribed: {
                    $cond: {
                        if: {$in: [req.user?._id, "$subscribers.subscriber"]},
                        then: true,
                        else: false
                    }
                }

            }
        },
        {
            $project: {
                fullName: 1,
                username: 1,
                subscribersCount: 1,
                channelsSubscribedToCount: 1,
                isSubscribed: 1,
                avatar: 1,
                coverImage: 1,
                email: 1

            }
        }
    ])

    if(!channel?.length){
        throw new ApiError(404 , "channel does not exixt")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            channel[0],
            "User Channel fetch successfully"
        )
    )

});



const getwatchHistory = asyncHandler(async(req, res) => {
    const user = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchHistory",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    $project: {
                                        fullName: 1,
                                        username: 1,
                                        avatar: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields:{
                            owner:{
                                $first: "$owner"
                            }
                        }
                    }
                ]
            }
        }
    ])

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            user[0].watchHistory,
            "Watch history fetched successfully"
        )
    )
});


export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannelProfile,
    getwatchHistory

}
