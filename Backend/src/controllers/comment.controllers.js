import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { Comment } from "../models/comments.model.js";
import { Video } from "../models/video.model.js";
import mongoose from "mongoose";
const getVideoComments = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;
  const pageNum = Number(page);
  const limitNum = Number(limit);
  if (!videoId) {
    throw new ApiError(400, "not get videoId from params");
  }
  if (!pageNum || !limitNum || pageNum === 0) {
    throw new ApiError(400, "Please provide a valid input");
  }
  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(404, "video id is not a valid");
  }
  const getComments = await Comment.aggregate([
    {
      $match: {
        video: new mongoose.Types.ObjectId(videoId),
      },
    },
    {
      $skip: (pageNum - 1) * limitNum,
    },
    {
      $limit: limitNum,
    },
    {
      $lookup: {
        from: "users",
        localField: "ownerOfComment",
        foreignField: "_id",
        as: "ownerOfComment",
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
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "comment",
        as: "totalLikeOnComment",
      },
    },
    {
      $addFields: {
        likedByUser: {
          $in: [req.user?._id, "$totalLikeOnComment.likedBy"],
        },
      },
    },
    {
      $group: {
        _id: "$_id",
        content: { $first: "$content" },
        ownerOfComment: { $first: "$ownerOfComment" },
        videoToComment: { $first: "$videoToComment" },
        createdAt: { $first: "$createdAt" },
        updatedAt: { $first: "$updatedAt" },
        totalLikesOnComment: { $sum: { $size: "$totalLikesOnComment" } },
        likedByUser: { $first: "$likedByUser" },
      },
    },
    {
      $addFields: {
        owner: {
          $first: "$owner",
        },
        isOwner: {
          $cond: {
            if: { $eq: [req.user?._id, { $arrayElemAt: ["$owner._id", 0] }] },
            then: true,
            else: false,
          },
        },
      },
    },
  ]);
  if (!getComments?.length) {
    throw new ApiError(
      404,
      "No comments found for this video. Or, you may try a lower page number."
    );
  }
  return res
    .status(200)
    .json(new ApiResponse(200, getComments, "Comments fetched successfully"));
});
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
    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      {
        $set: { content: content },
      },
      { new: true }
    );
    return res
      .status(200)
      .json(
        new ApiResponse(200, updatedComment, "successfully Update comment")
      );
  } catch (error) {
    throw new ApiError(500, "Unable to update comment");
  }
});
const deleteComment = asyncHandler(async (req, res) => {
  const { commentId, videoId } = req.params;
  if (!commentId) {
    throw new ApiError(404, "unable to get comment");
  }
  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    throw new ApiError(404, "comment id is not a valid");
  }
  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(400, "Comment have been already delete");
  }
  if (videoId !== comment.videoToComment.toString()) {
    throw new ApiError(200, "which video to delete the comment is not find");
  }
  if (comment.ownerOfComment.toString() !== req.user?._id.toString()) {
    throw new ApiError(400, "you can not delete comment");
  }
  try {
    await Comment.findByIdAndDelete(commentId);
    //TODO delete Likes also
    return res
      .status(200)
      .json(new ApiResponse(200, "Comment deleted successfully"));
  } catch (error) {
    throw new ApiError(400, "unable to delete comment please try again");
  }
});

export { getVideoComments, addComment, updateComment, deleteComment };
