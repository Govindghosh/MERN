import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  uploadVideo,
  getAllVideo,
  updateVideo,
  deleteVideo,
} from "../controllers/video.controller.js";

const router = Router();

// Route for uploading videos
router.route("/uploadVideo").post(
  verifyJWT,
  upload.fields([
    {
      name: "videoFile",
      maxCount: 1,
    },
    {
      name: "thumbnail",
      maxCount: 1,
    },
  ]),
  uploadVideo
);

router.route("/get-allVideo").get(verifyJWT, getAllVideo);
router.route("/channel/video/:videoId").patch(
  verifyJWT,
  upload.fields([
    {
      name: "videoFile",
      maxCount: 1,
    },
    {
      name: "thumbnail",
      maxCount: 1,
    },
  ]),
  updateVideo
);
router.route("/delete/:videoId").delete(verifyJWT, deleteVideo);

export default router;
