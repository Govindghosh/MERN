import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  toggleSubscription,
  getChannelSubscriber,
  getSubscribedChannels,
} from "../controllers/subscription.controller.js";

const router = Router();

router.route("/c/:channelId").patch(verifyJWT, toggleSubscription);

router.route("/s/:channelId").get(verifyJWT, getChannelSubscriber);

router.route("/:subscriberId").get(verifyJWT, getSubscribedChannels);

export default router;
