import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addComment,  } from "../controllers/comment.controllers.js"
import { addComment, updateComment } from "../controllers/comment.controllers.js"

const router = Router();

router.route("/addComment/:videoId").post(verifyJWT, addComment)

export default router;