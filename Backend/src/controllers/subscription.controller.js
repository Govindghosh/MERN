import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "invalid Channel");
  }
  const channel = await User.findById(channelId);
  if (!channel) {
    throw new ApiError(400, "Channel does not exist");
  }
  const loggedInUser = req.user?._id;
  if (!loggedInUser) {
    throw new ApiError(400, "please LogIn");
  }
  const userUnsubscribed = await Subscription.findOneAndDelete({
    subscriber: loggedInUser,
    channel: channel,
  });
  if (userUnsubscribed) {
    return res
      .status(200)
      .json(new ApiResponse(200, "Successfully Unsubscribed Channel"));
  }
  if (!userUnsubscribed) {
    const userSubscribed = await Subscription.create({
      subscriber: loggedInUser,
      channel,
    });
    const createdSubscriber = await Subscription.findById(userSubscribed._id);
  }
  return res.status(200).json(new ApiResponse(200, "Successfully Subscribed"));
});
const getChannelSubscriber = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Channel not exist");
  }
  if (req.user?._id.toString() !== channelId) {
    throw new ApiError(400, "Unauthorized request you are not a channel owner");
  }
  const getSubscribe = await Subscription.aggregate([
    {
      $match: {
        channel: new mongoose.Types.ObjectId(channelId),
      }
    },
    {
      $facet: {
        subscribers: [
          {
            $lookup: {
              from: "users",
              localField: "subscriber",
              foreignField: "_id",
              as: "subscriber",
              pipeline: [
                {
                  $project: {
                    username: 1,
                    fullName: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
                subscribers: {
                  $first: "$subscribers",
                },
              },
          },
        ],
        subscribersCount: [{ $count: "subscribers" }],
      },
    },
  ]);
  console.log("getSubscribe", getSubscribe[[0]]);
  return res
    .status(200)
    .json(
      new ApiResponse(
        "200",
        getSubscribe[0],
        "All subscribers fetched successfully"
      )
    );
});
export { toggleSubscription, getChannelSubscriber };
