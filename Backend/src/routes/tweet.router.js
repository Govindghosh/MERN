import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createTweet,
  deleteTweet,
  updateTweet,
} from "../controllers/tweet.controller.js";

const router = Router();
router.route("/createTweet").post(verifyJWT, createTweet);
router.route("/delete/:tweetId").delete(verifyJWT, deleteTweet);
router.route("/updateTweet/:tweetId").patch(verifyJWT, updateTweet);
export default router;
