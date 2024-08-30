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
  const { userId } = req.params;
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
const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  console.log("playlist", playlistId);
  if (!mongoose.Types.ObjectId.isValid(playlistId)) {
    throw new ApiError(400, "Playlist id are not a valid");
  }
  const playlist = await Playlist.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(playlistId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [
          {
            $project: {
              _id: 1,
              fullName: 1,
              username: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        owner: { $first: "$owner" },
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "videos",
        foreignField: "_id",
        as: "videos",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [
                {
                  $project: {
                    _id: 1,
                    fullName: 1,
                    username: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              owner: { $first: "$owner" },
            },
          },
        ],
      },
    },
  ]);
  if (!playlist.length) {
    throw new ApiError(404, "This playlist does not exist");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist fetched"));
});
const getPlaylistByName = asyncHandler(async (req, res) => {});
const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  
  if (!mongoose.Types.ObjectId.isValid(playlistId) || !mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid playlist or video ID");
  }
  
  const video = await Video.findById(videoId);
  const playlist = await Playlist.findById(playlistId);
  
  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }
  
  console.log("Playlist videos type:", typeof playlist.videos);
  console.log("Is playlist videos an array:", Array.isArray(playlist.videos));
  
  if (playlist.owner.toString() != req.user._id.toString()) {
    throw new ApiError(403, "You cannot add to this playlist");
  }
  
  if (!video) {
    throw new ApiError(404, "Video not found");
  }
  
  if (Array.isArray(playlist.videos) && playlist.videos.includes(videoId)) {
    throw new ApiError(400, "Video already added to the playlist");
  }
  
  try {
    const updatedPlaylist = await Playlist.findByIdAndUpdate(
      playlistId,
      { $push: { videos: videoId } },
      { new: true }
    );
    return res
      .status(200)
      .json(
        new ApiResponse(200, updatedPlaylist, "Video added to your playlist")
      );
  } catch (error) {
    console.error(error);
    throw new ApiError(500, "Something went wrong");
  }
});

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
