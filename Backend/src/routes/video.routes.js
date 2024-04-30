import { Router } from "express";
import {
  upload,
  checkFileTypeAndSize,
} from "../middlewares/multer.middleware.js";
import { cleanupFilesOnError } from "../middlewares/cleanupFilesOnError.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { uploadVideo } from "../controllers/video.controller.js";

const router = Router();

// Route for uploading videos
router.post(
  "/uploadVideo",
  verifyJWT,
  upload.fields([
    { name: "videoFile", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  (req, res, next) => {
    // Custom middleware to set local file paths in the request
    req.thumbnailLocalfilePath = req.files["thumbnail"]
      ? req.files["thumbnail"][0].path
      : null;
    req.videoFileLocalPath = req.files["videoFile"]
      ? req.files["videoFile"][0].path
      : null;
    next();
  }
  ,
  checkFileTypeAndSize,
  uploadVideo,
  cleanupFilesOnError
);

export default router;
