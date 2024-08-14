import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { Tweet } from "../models/tweet.model.js";
import { Like } from "../models/like.model.js";
import mongoose from "mongoose";

const createTweet = asyncHandler(async (req, res) => {
  const { text } = req.body;
  if (!text || text.trim() === "") {
    throw new ApiError(400, "text is empty");
  }
  const user = req.user?._id;
  const tweet = await Tweet.create({ text, tweetOwner: user });

  const createdTweet = await Tweet.findById(tweet._id);
  if (!createdTweet) {
    throw new ApiError(400, "something went wrong");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, createdTweet, " Your Tweet now live "));
});
const getUserTweets = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  console.log("======From getUserTweets userId", userId)
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(404, "User Id is not valid");
  }
  const tweet = await Tweet.aggregate([
    {
      $match: {
        tweetOwner: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "tweet",
        as: "tweetLikedBy",
      },
    },
    {
      $group: {
        _id: "$_id",
        text: { $first: "$text" },
        totalTweetLikes: { $sum: { $size: "$tweetLikedBy" } },
        createdAt: { $first: "$createdAt" },
        updatedAt: { $first: "$updatedAt" },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);
  if (!tweet?.length) {
    throw new ApiError(402, "tweet not available");
  }
  const tweetedBy = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $addFields: {
        isTweetOwner: {
          $cond: {
            if: { $eq: [req.user?._id.toString(), userId]},
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        userName: 1,
        fullName: 1,
        avatar: 1,
        isTweetOwner: 1,
        createdAt: 1,
        updatedAt: 1,
      },
    },
  ]);
  const tweetListAndOwner = {
    tweet,
    tweetedBy,
  };
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        tweetListAndOwner,
        "All Tweet is Fetched Successfully"
      )
    );
});
const updateTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(tweetId)) {
    throw new ApiError(400, "Tweet Id is not valid");
  }
  const { content } = req.body;
  if (!content || content.trim() === "") {
    throw new ApiError(400, "Content can't be empty");
  }
  const tweet = await Tweet.findById(tweetId);
  if (!tweet) {
    throw new ApiError(400, "tweet was deleted");
  }
  if (tweet.tweetOwner.toString() != req.user?._id.toString()) {
    throw new ApiError(
      404,
      "You can not delete the tweet because you are not a owner of the tweet"
    );
  }
  await Tweet.updateOne(
    { _id: tweetId, tweetOwner: req.user?._id },
    { $set: { text: content } },
    { new: true }
  );
  return res.status(200).json(new ApiResponse(200, "tweet update"));
});
const deleteTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(tweetId)) {
    throw new ApiError(400, "Not a valid tweetId");
  }
  const tweet = await Tweet.findById(tweetId);
  if (!tweet) {
    throw new ApiError(404, "tweet was deleted");
  }
  if (req.user?._id.toString() != tweet.tweetOwner?._id.toString()) {
    throw new ApiError(405, "You can not Deleted this Tweet");
  }
  try {
    await Tweet.findByIdAndDelete(tweetId);
    await Like.deleteMany({ tweet: tweet._id });
    return res
      .status(200)
      .json(new ApiResponse(200, "Tweet deleted Successfully"));
  } catch (error) {
    throw new ApiError(
      500,
      "Try after some time we unable to delete at this moment"
    );
  }
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
