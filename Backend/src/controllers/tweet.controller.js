import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { Tweet } from "../models/tweet.model.js";
import { Like } from "../models/like.model.js";

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
const getUserTweets = asyncHandler(async (req, res) => {});
const updateTweet = asyncHandler(async (req, res) => {});
const deleteTweet = asyncHandler(async (req, res) => {});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
