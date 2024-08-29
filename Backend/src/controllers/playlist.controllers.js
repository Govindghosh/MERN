import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { Video } from "../models/video.model.js";
import { Playlist } from "../models/playlist.model.js";
import mongoose from "mongoose";

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  if (!name) {
    throw new ApiError(
      401,
      "Name and description are needed to create a playlist."
    );
  }
  const user = req.user?._id;
  const playlist = await Playlist.create({
    name,
    description,
    owner: user,
  });
  const createdPlaylist = await Playlist.findById(playlist._id);
  if (!createdPlaylist) {
    throw new ApiError(500, "Something went wrong while creating a playlist");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, createdPlaylist, "Playlist created successfully")
    );
});
const getUserPlaylist = asyncHandler(async (req, res) => {
  const {userId} = req.params;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(404, "User Id not found!");
  }
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(400, "User not found!");
  }
  const userPlaylist = await Playlist.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(user),
      },
    },
  ]);
  if (!userPlaylist.length) {
    throw new ApiError(410, "User don't have playlist");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, userPlaylist, "playlist fatched"));
});
const getPlaylistById = asyncHandler(async (req, res) => {});
const getPlaylistByName = asyncHandler(async (req, res) => {});
const addVideoToPlaylist = asyncHandler(async (req, res) => {});
const updatePlaylist = asyncHandler(async (req, res) => {});
const deletePlaylist = asyncHandler(async (req, res) => {});
const removeVideoFromPlaylist = asyncHandler(async (req, res) => {});
export {
  createPlaylist,
  getUserPlaylist,
  getPlaylistById,
  getPlaylistByName,
  addVideoToPlaylist,
  updatePlaylist,
  deletePlaylist,
  removeVideoFromPlaylist,
};
