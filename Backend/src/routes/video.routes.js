import { Router } from "express";
import {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
} from "../controllers/video.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// --- Public Routes ---
// Anyone can perform these actions, even if not logged in.
router.route("/").get(getAllVideos);
router.route("/:videoId").get(getVideoById);


// --- Protected Routes ---
// The verifyJWT middleware will be applied to all routes BELOW this line.
// A user MUST be logged in to publish, update, or delete videos.
router.use(verifyJWT);

router.route("/").post(
    upload.fields([
        {
            name: "videoFile",
            maxCount: 1,
        },
        {
            name: "thumbnail",
            maxCount: 1,
        },
    ]),
    publishAVideo
);

router
    .route("/:videoId")
    .delete(deleteVideo)
    .patch(upload.single("thumbnail"), updateVideo);

router.route("/toggle/publish/:videoId").patch(togglePublishStatus);


export default router;