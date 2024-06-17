import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { toggleLike, getLikesVideo } from "../controllers/like.controller.js"

const router = Router();

router.route("/:type/:id").patch(verifyJWT, toggleLike)
router.route("/getLikesVideo").get(verifyJWT, getLikesVideo)

export default router;