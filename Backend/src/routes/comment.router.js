import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  addComment,
  updateComment,
  deleteComment,
  getVideoComments,
} from "../controllers/comment.controllers.js";

const router = Router();

router.route("/addComment/:videoId").post(verifyJWT, addComment);
router.route("/:videoId/:commentId").patch(verifyJWT, updateComment);
router.route("/:user/:videoId/:commentId").delete(verifyJWT, deleteComment);
router.route("/:videoId").get(verifyJWT, getVideoComments)
export default router;
