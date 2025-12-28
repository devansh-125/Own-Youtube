import { Router } from "express";
import {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus,
    getUpNextVideos
} from "../controllers/video.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import jwt from "jsonwebtoken";

import { verifyAuth } from "../middlewares/verifyAuth.middleware.js";

const router = Router();

// Optional auth middleware - tries to authenticate but doesn't fail if not logged in
const optionalAuth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization || req.cookies.accessToken;
        if (authHeader) {
            const token = authHeader.startsWith("Bearer ")
                ? authHeader.split(" ")[1]
                : authHeader;
            
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            req.user = decoded;
        }
    } catch (error) {
        // Silently continue even if auth fails - user is just not authenticated
    }
    next();
};

// These routes are public and can be accessed by anyone (with optional auth for subscription info)
router.route("/").get(optionalAuth, getAllVideos);
router.route("/up-next/:channelId/:currentVideoId").get(getUpNextVideos);
router.route("/:videoId").get(optionalAuth, getVideoById);

router.use(verifyAuth);

// Because of router.use() above, this route is now protected for all logged-in users.
router.route("/").post(
    upload.fields([
        { name: "videoFile", maxCount: 1 },
        { name: "thumbnail", maxCount: 1 },
    ]),
    publishAVideo
);

router.route("/:videoId")
    .delete(deleteVideo)
    .patch(upload.single("thumbnail"), updateVideo);

router.route("/toggle/publish/:videoId").patch(togglePublishStatus);

export default router;
