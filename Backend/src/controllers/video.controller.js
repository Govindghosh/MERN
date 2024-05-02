import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Video } from "../models/video.model.js";
import mongoose from "mongoose";

const uploadVideo = asyncHandler(async (req, res) => {
  const { title, description, isPublished } = req.body;
  const existsTitle = await Video.findOne({
    title,
  });
  if (existsTitle) {
    throw new ApiError(
      409,
      "Title already exists in you videos please change the title"
    );
  }

  // Input validation
  if (!title || !description) {
    throw new ApiError(400, "Title or Description missing");
  }
  console.log("my console req.files", req.files);
  // Check if files are uploaded
  if (!req.files || !req.files.videoFile || !req.files.thumbnail) {
    throw new ApiError(400, "Video file or Thumbnail not uploaded");
  }

  const videoFileLocalPath = req.files.videoFile[0].path;
  const thumbnailLocalPath = req.files.thumbnail[0].path;

  console.log("thumbnailLocalPath", thumbnailLocalPath);

  // Upload video file to Cloudinary
  const videoFileUploadResult = await uploadOnCloudinary(videoFileLocalPath);

  if (!videoFileUploadResult.url) {
    throw new ApiError(500, "Could not upload video file to Cloudinary");
  }

  // Upload thumbnail file to Cloudinary
  const thumbnailUploadResult = await uploadOnCloudinary(thumbnailLocalPath);

  const duration =
    typeof videoFileUploadResult.duration === "string"
      ? parseFloat(videoFileUploadResult.duration)
      : videoFileUploadResult.duration;

  // Create new video document
  const newVideo = await Video.create({
    videoFile: videoFileUploadResult.url,
    thumbnail: thumbnailUploadResult.url,
    title,
    description,
    duration,
    // owner: req.user ? mongoose.Types.ObjectId(req.user._id) : null,
    owner: req.user?._id,
    isPublished: isPublished,
  });

  // Respond with success message
  return res
    .status(201)
    .json(new ApiResponse(200, newVideo, "Video uploaded successfully"));
});

const getAllVideo = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;

  try {
    let filter = {};
    if (userId) {
      filter.owner = userId; // Filter by userId if provided
    }
    if (query) {
      // If query string provided, search by title and description
      filter.$or = [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ];
    }

    // Count total documents matching filter
    const total = await Video.countDocuments(filter);

    // Find videos based on filter, pagination, sorting
    const videos = await Video.find(filter)
      .sort({ [sortBy || "createdAt"]: sortType === "desc" ? -1 : 1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .exec();

    // Respond with paginated result
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          videos,
          totalPages: Math.ceil(total / limit),
          currentPage: page,
          totalVideos: total,
        },
        "Videos retrieved successfully"
      )
    );
  } catch (error) {
    throw new ApiError(
      500,
      error.message || "Internal Server Error",
      "Can't get Videos"
    );
  }
});

export { getAllVideo, uploadVideo };
