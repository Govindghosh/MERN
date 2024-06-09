import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { Comment } from "../models/comments.model.js";
import { Video } from "../models/video.model.js";
import mongoose from "mongoose";
const getVideoComments = asyncHandler(async (req, res) => {});
const addComment = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { contant } = req.body;
  console.log("contant", contant);
  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Video ID is not valid.");
  }
  if (!contant || contant.trim() === "") {
    throw new ApiError(400, "Content can't be empty");
  }
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(200, "Video not exist");
  }
  const user = req.user?._id;
  const comment = await Comment.create({
    contant,
    videoToComment: video,
    ownerOfComment: user,
  });
  const getComment = await Comment.findById(comment._id)

    if (!getComment) {
        throw new ApiError(500, "Something went wrong while posting a comment")
    };
  return res
    .status(201)
    .json(new ApiResponse(200, getComment, "Comment posted successfully."));
});
const updateComment = asyncHandler(async (req, res) => {});
const deleteComment = asyncHandler(async (req, res) => {});

export { getVideoComments, addComment, updateComment, deleteComment };
