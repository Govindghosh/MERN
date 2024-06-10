import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addComment, updateComment } from "../controllers/comment.controllers.js"

const router = Router();

router.route("/addComment/:videoId").post(verifyJWT, addComment)
router.route("/:videoId/:commentId").patch(verifyJWT, updateComment)

export default router;