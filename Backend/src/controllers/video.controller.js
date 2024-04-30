import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary, deleteOnCloudinary } from "../utils/cloudinary.js";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";

const uploadVideo = asyncHandler(async (req, res) => {
  try {
    const { title, description, isPublished } = req.body;
    if ([title, description].some((field) => field?.trim() === "")) {
      throw new ApiError(400, "All fields are required");
    }

    if (!title || !description) {
      throw new ApiError(400, "title video and description files are required");
    }
    let videoFileLocalPath;
    let thumbnailLocalfilePath;

    // const localThumbnailPath = req.files?.thumbnail?.[0]?.path;
    // const localVideoPath = req.files?.videoFile?.[0]?.path;
    // console.log(
    //   "localVideoPath",
    //   localVideoPath,
    //   "-------",
    //   "localThumbnailPath",
    //   localThumbnailPath
    // );
    if (
      req.files &&
      Array.isArray(req.files.videoFile) &&
      req.files.videoFile.length > 0
    ) {
      videoFileLocalPath = req.files?.videoFile[0]?.path;
    }
    if (
      req.files &&
      Array.isArray(req.files.thumbnail) &&
      req.files.thumbnail.length > 0
    ) {
      thumbnailLocalfilePath = req.files?.thumbnail[0]?.path;
    }
    console.log(
      "videoFileLocalPath",
      videoFileLocalPath,
      "-------",
      "thumbnailLocalfilePath",
      thumbnailLocalfilePath
    );

    // Upload files to Cloudinary
    const videoFile = await uploadOnCloudinary(videoFileLocalPath);
    const thumbnail = await uploadOnCloudinary(thumbnailLocalfilePath);

    if (!videoFile) {
      throw new ApiError(500, "Error uploading videofiles to Cloudinary");
    }
    if (!thumbnail) {
      throw new ApiError(500, "Error uploading thumbnail to Cloudinary");
    }

    const duration =
      typeof videoFile.duration === "string"
        ? parseFloat(videoFile.duration)
        : videoFile.duration;

    // Create new video document
    const newVideo = await Video.create({
      videoFile,
      thumbnail,
      title,
      description,
      duration,
      isPublished,
      owner:
        req.user && req.user._id
          ? new mongoose.Types.ObjectId(req.user._id)
          : null,
    });

    // Respond with success message
    return res
      .status(201)
      .json(new ApiResponse(200, newVideo, "Video uploaded successfully"));
  } catch (error) {
    console.error("Error uploading video:", error); // Log the error for debugging
    throw new ApiError(500, "Internal server error while uploading video");
  }
});

const getAllVideo = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  try {
  } catch (error) {
    throw new ApiError(402, error, "Can't get Video");
  }
});

export { getAllVideo, uploadVideo };
