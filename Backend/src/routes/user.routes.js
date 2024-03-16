import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  refreshAccessToken,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Route for user registration
router.route("/register").post(
  // Apply multer middleware for handling file uploads
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
  ]),
  registerUser
);

// Route for user login
router.route("/login").post(loginUser);

// Route for user logout
router.route("/logout").post(verifyJWT, logoutUser);
// Route for Refresh Tokens
router.route("/refresh-token").post(refreshAccessToken);

export default router;
