// import { User } from "../models/user.model.js";
// import jwt from "jsonwebtoken";

// export const verifyAuth = (req, res, next) => {
//   try {
//     // ✅ Case 1: Session-based (Google)
//     if (req.isAuthenticated && req.isAuthenticated()) {
//       req.user = req.user || req.session.passport.user;
//       return next();
//     }

//     // ✅ Case 2: JWT-based
//     const authHeader = req.headers.authorization || req.cookies.accessToken;
//     if (!authHeader) {
//       return res.status(401).json({ success: false, message: "No auth token" });
//     }

//     const token = authHeader.startsWith("Bearer ")
//       ? authHeader.split(" ")[1]
//       : authHeader;

//     const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
//     req.user = decoded;
//     next();
//   } catch (error) {
//     console.error("verifyAuth error:", error.message);
//     return res.status(401).json({ success: false, message: "Invalid or expired token" });
//   }
// };


import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const verifyAuth = async (req, res, next) => {
    console.log("\n--- [verifyAuth] CHECKING AUTH ---");

    if (req.isAuthenticated()) {
        console.log("[verifyAuth] SUCCESS: User is authenticated via session.");
        console.log("[verifyAuth] User ID:", req.user?._id);
        return next();
    }
    
    console.log("[verifyAuth] INFO: No session found, checking for JWT.");

    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            console.error("[verifyAuth] FAILURE: No token provided.");
            return res.status(401).json({ message: "No session or token provided" });
        }
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decodedToken?._id).select("-password");
        if (!user) {
            console.error("[verifyAuth] FAILURE: Invalid token.");
            return res.status(401).json({ message: "Invalid token, user not found" });
        }
        req.user = user;
        console.log("[verifyAuth] SUCCESS: User is authenticated via JWT.");
        console.log("[verifyAuth] User ID:", req.user?._id);
        next();
    } catch (error) {
        console.error("[verifyAuth] FAILURE: JWT verification error:", error.message);
        return res.status(401).json({ message: "Token is invalid or has expired" });
    }
};