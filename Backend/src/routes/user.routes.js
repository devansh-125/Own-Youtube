import { Router } from "express";
import {
    changeCurrentPassword,
    getCurrentUser,
    getUserChannelProfile,
    getwatchHistory,
    loginUser,
    logoutUser,
    refreshAccessToken,
    registerUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    addToWatchHistory
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyAuth } from "../middlewares/verifyAuth.middleware.js";
import passport from 'passport';

const router = Router();

router.route("/register").post(
    upload.fields([
        { name: "avatar", maxCount: 1 },
        { name: "coverImage", maxCount: 1 }
    ]),
    registerUser
);

router.route("/login").post(loginUser);

// Protected Routes
router.route("/logout").post(verifyAuth, logoutUser);
router.route("/refresh_token").post(refreshAccessToken);
router.route("/change-password").post(verifyAuth, changeCurrentPassword);
router.route("/current-user").get(verifyAuth, getCurrentUser);
router.route("/update-account").patch(verifyAuth, updateAccountDetails);
router.route("/avatar").patch(verifyAuth, upload.single("avatar"), updateUserAvatar);
router.route("/cover-image").patch(verifyAuth, upload.single("coverImage"), updateUserCoverImage);
router.route("/c/:username").get(verifyAuth, getUserChannelProfile);
router.route("/history").get(verifyAuth, getwatchHistory);
router.route("/history/:videoId").post(verifyAuth, addToWatchHistory);

// Google OAuth Routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: 'http://localhost:5173/login' }),
  (req, res) => {
    res.redirect('http://localhost:5173');
  }
);

export default router;