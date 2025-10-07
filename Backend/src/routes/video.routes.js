import { Router } from "express";
import {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus,
    toggleVideoLike,
    toggleVideoDislike // We will create this controller next
} from "../controllers/video.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// --- Public Routes ---
// Anyone, logged in or not, can access these.
router.route("/").get(getAllVideos);
router.route("/:videoId").get(getVideoById);


// --- Protected Routes ---
// From this line onwards, a user MUST be logged in.
// The `verifyJWT` middleware acts as a gatekeeper.
router.use(verifyJWT);

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
router.route("/toggle/like/:videoId").patch(toggleVideoLike);
router.route("/toggle/dislike/:videoId").patch(toggleVideoDislike);


export default router;