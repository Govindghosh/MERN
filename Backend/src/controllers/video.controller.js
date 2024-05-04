import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { deleteOnCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import { Video } from "../models/video.model.js";
import mongoose, { isValidObjectId } from "mongoose";

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
const updateVideo = asyncHandler(async (req, res) => {
  const { username, videoId } = req.params;
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "video id is not matched in the Collection");
  }
  // if (!isValidObjectId(username)) {
  //   throw new ApiError(400, "username id is not matched in the Collection");
  // }
  const { title, description } = req.body;
  const videoFileLocalPath = req.files.videoFile[0].path;
  const thumbnailLocalPath = req.files.thumbnail[0].path;
  if (
    (!title || title.trim() === "") &&
    (!description || !description.trim() === "") &&
    !thumbnailLocalPath &&
    !videoFileLocalPath
  ) {
    throw new ApiError(400, "Atleast one field is required");
  }
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(400, "video is not available please refresh");
  }
  if (req.user?._id.toString() != video.owner.toString()) {
    throw new ApiError(400, "You are not a owner of this file");
  }
  const thumbnailFile = await uploadOnCloudinary(thumbnailLocalPath);
  const videoFile = await uploadOnCloudinary(videoFileLocalPath);
  if (!thumbnailFile.url && !videoFile.url) {
    throw new ApiError(500, "Error while uploading files and getting the URL");
  }
  if (thumbnailFile.url || videoFile.url !== "") {
    await deleteOnCloudinary(video.thumbnail);
    await deleteOnCloudinary(video.videoFile);
  }
  try {
    let updatedVideo;
    if (title && description && thumbnailFile.url && videoFile.url) {
      updatedVideo = await Video.findByIdAndUpdate(
        videoId,
        {
          $set: {
            title: title,
            description: description,
            thumbnail: thumbnailFile.url,
            videoFile: videoFile.url,
          },
        },
        { new: true }
      );
    }
    return res
      .status(200)
      .json(new ApiResponse(200, updatedVideo, "Video updated successfully"));
  } catch (error) {
    throw new ApiError(500, error.message || "internal server error");
  }
});
const deleteVideo = asyncHandler(async (req, res) => {
  //get video which video want to delete;
  // check the owner of video if is same then do
  //delete the video
  // delete cloudnary url also
  // TODO: delete like && comments
  const { videoId } = req.params;
  console.log("videoId from the params", videoId);
  if (!isValidObjectId(videoId)) {
    throw new ApiError(409, "Inavalid video ID");
  }
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(409, "video is missing in database");
  }
  if (req.user?._id.toString() != video.owner.toString()) {
    throw new ApiError(
      400,
      "you can't delete this video - you are not a owner of video"
    );
  }
  const videoUrl = video.videoFile;
  const thumbnailUrl = video.thumbnail;
  if (!videoUrl || !thumbnailUrl) {
    throw new ApiError(500, "video and thumbnail missing at database");
  }

  await Video.findByIdAndDelete(videoId);
  const response = Video.findById(videoId);
  await deleteOnCloudinary(thumbnailUrl);
  await deleteOnCloudinary(videoUrl);
  return res
    .status(200)
    .json(new ApiResponse(200, response?.[0], "video successfully deleted"));
});

export { getAllVideo, uploadVideo, updateVideo, deleteVideo };
