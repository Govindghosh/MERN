import { Video } from "../models/video.model.js";
import { Comment } from "../models/comments.model.js";
import { Like } from "../models/like.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";
const toggleLike = asyncHandler(async (req, res) => {
  const { type, id } = req.params; // Expecting id and type in params
  const types = ["video", "comment", "tweet"];

  if (!types.includes(type)) {
    throw new ApiError(400, "Invalid type");
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid id");
  }

  let Model;
  if (type === "video") {
    Model = Video;
  } else if (type === "comment") {
    Model = Comment;
  } else if (type === "tweet") {
    Model = Tweet;
  }

  const entity = await Model.findById(id);
  if (!entity) {
    throw new ApiError(404, `This ${type} does not exist`);
  }

  const loggedInUser = req.user?._id;
  const likeCriteria = { likedBy: loggedInUser };
  likeCriteria[type] = entity;

  const entityIsLiked = await Like.findOneAndDelete(likeCriteria);

  if (entityIsLiked) {
    return res
      .status(200)
      .json(
        new ApiResponse(200, `Your like has been removed from this ${type}`)
      );
  }

  const entityLike = await Like.create({
    likedBy: loggedInUser,
    [type]: entity,
  });

  const createdLikedEntity = await Like.findById(entityLike._id);

  if (!createdLikedEntity) {
    throw new ApiError(500, `Something went wrong while liking this ${type}`);
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, createdLikedEntity, `${type} liked successfully`)
    );
});
const getLikesVideo = asyncHandler(async(req, res)=>{


})
export { toggleLike, getLikesVideo };
