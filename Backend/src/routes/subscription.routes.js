import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  toggleSubscription,
  getChannelSubscriber,
} from "../controllers/subscription.controller.js";

const router = Router();

router.route("/c/:channelId").patch(verifyJWT, toggleSubscription);

router.route("/s/:channelId").get(verifyJWT, getChannelSubscriber);

export default router;
