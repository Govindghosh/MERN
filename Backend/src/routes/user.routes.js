import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  refreshAccessToken,
  getCurrentUser,
  changeCurrentPassword,
  updateAccountDetails,
  updateUserCoverImage,
  updateUserAvatar,
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
router.route("/getCurrentUser").post(verifyJWT, getCurrentUser);
//Route for Update User Details in text deta
router.route("/updateAccountDetails").post(verifyJWT, updateAccountDetails);
//Route For Update the Avatar Image
router
  .route("/updateUserAvatar")
  .post(verifyJWT, upload.single("avatar"), updateUserAvatar);
//Route For Update Cover Image
router
  .route("/updateUserCoverImage")
  .post(verifyJWT, upload.single("coverImage"), updateUserCoverImage);

export default router;
