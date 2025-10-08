import { Router } from 'express';
import {
    getLikedVideos,
    toggleCommentLike,
    toggleVideoLike,
    toggleVideoDislike
} from "../controllers/like.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// All like-related routes require a user to be logged in
router.use(verifyJWT);

router.route("/toggle/video/:videoId").patch(toggleVideoLike);
router.route("/toggle/dislike/:videoId").patch(toggleVideoDislike);
router.route("/toggle/comment/:commentId").patch(toggleCommentLike);
router.route("/liked-videos").get(getLikedVideos);

export default router;