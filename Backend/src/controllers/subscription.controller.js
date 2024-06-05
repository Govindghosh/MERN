import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async(req, res) => {
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
  return res
            .status(200)
            .json(new ApiResponse(200, "Successfully Subscribed"));
});
const getChannelSubscriber = asyncHandler(async(req, res)=>{})
export { toggleSubscription, getChannelSubscriber };
