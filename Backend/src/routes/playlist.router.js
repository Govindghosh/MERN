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
router.route("/getPlaylistById/:playlistId").get(verifyJWT, getPlaylistById);
router.route("/addVideoToPlaylist/:playlistId/:videoId").patch(verifyJWT, addVideoToPlaylist);
router.route("/updatePlaylist/:playlistId").patch(verifyJWT, updatePlaylist);
router.route("/deletePlaylist/:playlistId").delete(verifyJWT, deletePlaylist);
router.route("/removeVideoFromPlaylist/:playlistId/:videoId").patch(verifyJWT, removeVideoFromPlaylist)
export default router;
