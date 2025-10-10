import { Router } from 'express';
import {
    getVideoComments,
    addComment,
    // updateComment, // Baad mein add karenge
    // deleteComment  // Baad mein add karenge
} from "../controllers/comment.controller.js";
import { verifyAuth } from "../middlewares/verifyAuth.middleware.js";

const router = Router();

// GET comments route sabke liye public hai
router.route("/:videoId").get(getVideoComments);

// POST comment route sirf logged-in users ke liye hai
router.route("/:videoId").post(verifyAuth, addComment);


export default router;