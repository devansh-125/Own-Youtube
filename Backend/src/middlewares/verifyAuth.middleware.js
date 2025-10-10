import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const verifyAuth = async (req, res, next) => {
    // Priority 1: Check for a valid session (from Google login)
    if (req.isAuthenticated()) {
        // req.user is populated by Passport's session middleware, so we're good.
        return next();
    }

    // Priority 2: If no session, check for a JWT (from email/password login)
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            return res.status(401).json({ success: false, message: "No session or token provided" });
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decodedToken?._id).select("-password");

        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid token, user not found" });
        }

        // Manually attach the user to the request object for consistency
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: "Token is invalid or has expired" });
    }
};