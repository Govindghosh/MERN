import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  refreshAccessToken,
  getCurrentUser,
  changeCurrentPassword,
  updateAccountDetails,
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
// Route for change Current Password
router
  .route("/change-user-CurrentPassword")
  .post(verifyJWT, changeCurrentPassword);
  // Route for getCurrentUser
  router
  .route("/getCurrentUser")
  .post(verifyJWT, getCurrentUser);
  //Route for Update User Details in text deta
  router.route("/updateAccountDetails").post(verifyJWT,updateAccountDetails);

export default router;
