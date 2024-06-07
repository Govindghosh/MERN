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
      },
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
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;
  
  if (!mongoose.Types.ObjectId.isValid(subscriberId)) {
    throw new ApiError(400, "Subscriber ID is not valid.");
  }

  if (req.user?._id.toString() !== subscriberId) {
    throw new ApiError(
      400,
      "Unauthorized request: the request user and the subscriber are not the same person."
    );
  }

  const getChannels = await Subscription.aggregate([
    {
      $match: {
        subscriber: new mongoose.Types.ObjectId(subscriberId),
      },
    },
    {
      $facet: {
        channelSubscribedTo: [
          {
            $lookup: {
              from: "users",
              localField: "channel",
              foreignField: "_id",
              as: "channel",
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
              channel: {
                $first: "$channel",
              },
            },
          },
        ],
        channelsSubscribedToCount: [{ $count: "channel" }],
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, getChannels[0], "Subscribed channels fetched."));
});

export { toggleSubscription, getChannelSubscriber, getSubscribedChannels };
