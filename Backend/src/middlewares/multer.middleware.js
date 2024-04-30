import multer from "multer";

// Multer disk storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

// Define limits for file sizes (in bytes)
const limits = {
  fileSize: {
    avatar: 2000 * 1024, // 2000 KB
    coverImage: 2000 * 1024, // 2000 KB
    thumbnail: 2000 * 1024, // 2000 KB
    video: 2000 * 1024 * 1024, // 2 GB
  },
};

// Multer middleware configuration
export const upload = multer({
  storage,
  limits: limits.fileSize,
});

// Custom middleware to check file type and size
export const checkFileTypeAndSize = (req, res, next) => {
  try {
    // Extract uploaded files from request object
    const avatarFile =
      req.files && req.files["avatar"] ? req.files["avatar"][0] : null;
    const coverImageFile =
      req.files && req.files["coverImage"] ? req.files["coverImage"][0] : null;
    const thumbnailFile =
      req.files && req.files["thumbnail"] ? req.files["thumbnail"][0] : null;
    const uploadVideoFile =
      req.files && req.files["videoFile"] ? req.files["videoFile"][0] : null;

    // Validate file types and sizes
    if (
      avatarFile &&
      !isAllowedFileType(avatarFile.mimetype, allowedAvatarTypes)
    ) {
      throw new Error("Invalid avatar file type, allowed jpeg/png.");
    }
    if (avatarFile && avatarFile.size > limits.fileSize.avatar) {
      throw new Error("Avatar file size exceeds the limit (200KB).");
    }

    // Similar validation for cover image, thumbnail, and video files...

    // If everything is fine, move to the next middleware
    next();
  } catch (error) {
    console.log("Error in checkFileTypeAndSize middleware:", error);
    // Pass error to error handling middleware
    next(new Error("File validation error: " + error.message));
  }
};

// Function to check if the file type is allowed
const isAllowedFileType = (mimetype, allowedTypes) => {
  return allowedTypes.includes(mimetype);
};

// Define the allowed MIME types for each file type
const allowedAvatarTypes = ["image/jpeg", "image/png"];
const allowedCoverImageTypes = ["image/jpeg", "image/png"];
const allowedThumbNailTypes = ["image/jpeg", "image/png"];
const allowedVideoFileTypes = ["video/mp4"];
