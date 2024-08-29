import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createPlaylist,
  getUserPlaylist,
  getPlaylistById,
  getPlaylistByName,
  addVideoToPlaylist,
  updatePlaylist,
  deletePlaylist,
  removeVideoFromPlaylist,
} from "../controllers/playlist.controllers.js";

const router = Router();
router.route("/createPlaylist").post(verifyJWT, createPlaylist);
router.route("/getUserPlaylist/:userId").get(verifyJWT, getUserPlaylist);

export default router;
