import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const verifyAuth = (req, res, next) => {
  try {
    // ✅ Case 1: Session-based (Google)
    if (req.isAuthenticated && req.isAuthenticated()) {
      req.user = req.user || req.session.passport.user;
      return next();
    }

    // ✅ Case 2: JWT-based
    const authHeader = req.headers.authorization || req.cookies.accessToken;
    if (!authHeader) {
      return res.status(401).json({ success: false, message: "No auth token" });
    }

    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("verifyAuth error:", error.message);
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};


