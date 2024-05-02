import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { uploadVideo, getAllVideo } from "../controllers/video.controller.js";

const router = Router();

// Route for uploading videos
router.route("/uploadVideo").post(
  verifyJWT,
  upload.fields([
    {
      name: "videoFile",
      maxCount: 1000,
    },
    {
      name: "thumbnail",
      maxCount: 1,
    },
  ]),
  uploadVideo
);


router.route("/get-allVideo").get(verifyJWT, getAllVideo);

export default router;
