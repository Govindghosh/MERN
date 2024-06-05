import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { toggleSubscription } from "../controllers/subscription.controller.js";

const router = Router();

router.route("/c/:channelId").patch(verifyJWT, toggleSubscription);

export default router;