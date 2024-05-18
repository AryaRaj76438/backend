import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiRespose } from "../utils/ApiResponse.js";
import mongoose, { mongo } from "mongoose";


// generate access and refresh code
const generateAccessAndRefreshTokens = async(userId) =>{
    try {
        const user = await User.findById(userId)
        console.log(user.email)
        const accessToken = user.generateAccessToken()  
        const refreshToken = user.generateRefreshToken()

        console.log(`Refresh Token: ${refreshToken}`)
        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

const registerUser = asyncHandler(async(req, res)=>{
    const {fullname, email,username, password} = req.body;
    console.log(`Name: ${fullname} email: ${email} password: ${password}`);

    // Check validation 
    if([fullname, email, username, password].some((field)=>field?.trim()==="")){
        throw new ApiError(400, "All fields are required")
    }

    // Check user already exist
    const existedUser = await User.findOne({
        $or:[{username}, {email}]
    })

    if(existedUser){
        throw new ApiError(409, "User with email, or username already exists")
    }

    // req.body : contain all body
    const avatarLocalPath = req.files?.avatar[0]?.path;
    console.log(avatarLocalPath)
    // const coverImageLocationPath = req.files?.coverImage[0]?.path;

    let coverImageLocationPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length >0){
        coverImageLocationPath = req.files.coverImage[0].path
    }

    if(!avatarLocalPath) {throw new ApiError(400, "Avatar file is required")}
    
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocationPath)

    if(!avatar) {throw new ApiError(400, "Avatar file is required")}

    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage.url || "",
        email, 
        password,
        username: username.toLowerCase()
    })
    
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiRespose(200, createdUser, "User registered successfully")
    )

})

const loginUser = asyncHandler(async (req, res)=>{
    const {email, username, password} = req.body

    console.log(`Email: ${email} ${username}`)

    if(!email && !username) {
        return new ApiError(400, "username or email is required")
    }

    const user = await User.findOne({
        $or: [{email}, {username}]
    })

    console.log(user)

    if(!user) {
        return new ApiError(400, "Invalid credentials")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)
    if(!isPasswordValid) {
        return new ApiError(400, "Invalid credentials")
    }

    // console.log(`Password is correct`)

    const {accessToken,refreshToken} = await generateAccessAndRefreshTokens(user._id)

    console.log(`Access Token: ${accessToken}`)
    const loggedInUser =await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiRespose(
            200, {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged in successfully"
        )
    )

})

const logoutUser = asyncHandler(async(req,res)=>{
  await User.findByIdAndUpdate(req.user._id,{
    $set:{
        refreshToken: undefined
    }
  },{
    new: true
  })

  const options = {
    httpOnly: true,
    secure: true
  }

  return res.clearCookie("accessToken", options)
  .clearCookie("refreshToken", options)
  .json(new ApiRespose(200,{}, "User logged out"))
})

const refreshAccessToken = asyncHandler(async(req, res)=>{
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    console.log(`Incoming Refresh Token: ${incomingRefreshToken}`)

    if(!incomingRefreshToken){
        throw new ApiError(401, "Unauthorized access")
    }
    try {
        // decode the incoming token
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
        // decoded token contain the id of the user
        const user = await User.findById(decodedToken?._id)
        if(!user){
            throw new ApiError(401, "Invalid refresh token")
        }
    
        if(user?.refreshToken !==  incomingRefreshToken){
            throw new ApiError(401, "Refresh token is used or expired")
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const {newAccessToken, newRefreshToken} = await generateAccessAndRefreshTokens(user._id)
    
        return res.status(100)
                .cookie("accessToken",newAccessToken, options)
                .cookie("refreshToken", newRefreshToken, options)
                .json(
                    new ApiRespose(200,
                        {
                            newAccessToken, refreshToken: newRefreshToken
                        },
                        "Access token refreshed"
                    )
                )
    
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")

    }
})

const changeCurrentPassword = asyncHandler(async(req, res)=>{
    const {oldPassword, newPassword} = req.body

    // req.user = user: already loggedIn from there we can get userId
    const user = await User.findById(req.user?._id)

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)
    if(!isPasswordCorrect){
        throw new ApiError(401, "Old password is incorrect")
    }
    user.password = newPassword
    await user.save({validateBeforeSave:false})

    return res.status(200)
            .json(new ApiRespose(200,{}, "Password Changed Successfully"))
})

const getCurrentUser = asyncHandler(async(req, res)=>{
    // const user = await User.findById(req.user?._id)
    return res.status(200)
            .json(new ApiRespose(200, req.user, "current user feteched successfully"))
})

const updateAccountDetails = asyncHandler(async(req, res)=>{
    const {fullname, email} = req.body

    if(!fullname || !email) {
        throw new ApiError(400, "All fields are required")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id, 
        {
            $set: fullname, email: email
        }, {new: true}).select("-password"
        )

    return res.status(200)
            .json(new ApiRespose(200, user, "Account details updated successfully"))
})

const updateUserAvatar = asyncHandler(async(req,res)=>{
    const avatarLocalPath = req.file?.path
    if(!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is missing")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if(!avatar.url){
        throw new ApiError(400, "Avatar file is not uploaded")
    }

    const user = await User.findByIdAndUpdate(req.user?._id,
        {
            $set: {avatar: avatar.url}
        },{new: true}
    ).select("-password")


    return res.status(200)
            .json(new ApiRespose(200, user, "Avatar updated successfully"))
})

const updateUserCoverImage = asyncHandler(async(req,res)=>{
    const coverImageLocationPath = req.file?.path
    if(!coverImageLocationPath) {
        throw new ApiError(400, "Avatar file is missing")
    }

    const coverImage = await uploadOnCloudinary(coverImageLocationPath)

    if(!coverImage.url){
        throw new ApiError(400, "CoverImage file is not uploaded")
    }

    const user = await User.findByIdAndUpdate(req.user?._id,
        {
            $set: {coverImage: coverImage.url}
        },{new: true}
    ).select("-password")


    return res.status(200)
            .json(new ApiRespose(200, user, "CoverImage updated successfully"))
})

const getUserChannelProfile = asyncHandler(async(req, res)=>{
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
                $lookup:{
                    from: "subscriptions",
                    localField: "_id",
                    foreignField: "subscriber",
                    as: "subscribedTo"
                }
            }
        },
        {
            $addFields:{
                subscribersCount: {$size: "$subscribers"},
                cahnnelsubscribedToCount: {$size: "$subscribedTo"},
                isSubscribed: {
                    $cond:{
                        if: {$in: [req.user?._id, "$subscribers.subscriber"]},
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project:{
                fullname: 1, username: 1, subscribersCount: 1, cahnnelsubscribedToCount: 1,  isSubscribed: 1, avatar:1, coverImage: 1,
                email: 1
            }
        }
    ])

    if(!channel?.length){
        throw new ApiError(404, "channel doesnot exist")
    }
    return res.status(200)
            .json(new ApiRespose(200, channel[0], "User channel fetched successfully"))
})

const getWatchHistory = asyncHandler(async(req, res)=>{
    const id = new mongoose.Types.ObjectId(req.user?._id)

    const user = await User.aggregate([
        {
            $match: {
                _id: id   
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchHistory",
                pipeline:[
                {
                        $lookup:{
                        from: "users",
                        localField: "owners",
                        foreignField: "_id",
                        as: "owner",
                        pipeline:{
                            $project: {
                                fullname: 1, username: 1, avatar: 1
                            }
                        }
                    }
                }, {
                    $addFields:{
                        owner: {$arrayElemAt: ["$owner", 0]}
                    }
                }
                ]
            }
        }
    ])

    return res.status(200)
            .json(new ApiRespose(200, user[0].getWatchHistory, "Watched History Successfully"))
})

 
export {registerUser, loginUser, logoutUser, refreshAccessToken, changeCurrentPassword, 
    getCurrentUser, updateAccountDetails, updateUserAvatar, updateUserCoverImage,
    getUserChannelProfile, getWatchHistory}