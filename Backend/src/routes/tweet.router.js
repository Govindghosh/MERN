import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();
router.route("/").get(verifyJWT, )
export default router;