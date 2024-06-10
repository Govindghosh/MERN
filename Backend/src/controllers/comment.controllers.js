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
  const { content } = req.body;
  console.log("content", content);
  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Video ID is not valid.");
  }
  if (!content || content.trim() === "") {
    throw new ApiError(400, "Content can't be empty");
  }
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(200, "Video not exist");
  }
  const user = req.user?._id;
  const comment = await Comment.create({
    content,
    videoToComment: video,
    ownerOfComment: user,
  });
  const getComment = await Comment.findById(comment._id);

  if (!getComment) {
    throw new ApiError(500, "Something went wrong while posting a comment");
  }
  return res
    .status(201)
    .json(new ApiResponse(200, getComment, "Comment posted successfully."));
});
const updateComment = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const { videoId, commentId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    throw new ApiError(400, "comment Id is not valid.");
  }
  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Video Id is not valid.");
  }
  if (!content || content.trim() === "") {
    throw new ApiError(400, "Content can't be empty");
  }
  const oldComment = await Comment.findById(commentId);
  if (oldComment.videoToComment.toString() !== videoId) {
    throw new ApiError(400, "Invalid video");
  }
  if (oldComment.ownerOfComment?.toString() !== req.user?._id.toString()) {
    throw new ApiError(403, "You are not authorized to edit this comment");
  }
  try {
    const updatedComment  = await Comment.findByIdAndUpdate(
      commentId,
      {
        $set: { content: content },
      },
      { new: true }
    );
    return res
      .status(200)
      .json(new ApiResponse(200, updatedComment , "successfully Update comment"));
  } catch (error) {
    throw new ApiError(500, "Unable to update comment");
  }
});
const deleteComment = asyncHandler(async (req, res) => {});

export { getVideoComments, addComment, updateComment, deleteComment };
