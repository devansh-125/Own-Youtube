import { Router } from "express";
import {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus,
} from "../controllers/video.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

import { verifyAuth } from "../middlewares/verifyAuth.middleware.js";

const router = Router();

// These routes are public and can be accessed by anyone.
router.route("/").get(getAllVideos);
router.route("/:videoId").get(getVideoById);

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
