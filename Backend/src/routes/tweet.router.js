import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createTweet, deleteTweet } from "../controllers/tweet.controller.js";




const router = Router();
router.route("/createTweet").post(verifyJWT, createTweet);
router.route("/delete/:tweetId").delete(verifyJWT, deleteTweet)
export default router;
