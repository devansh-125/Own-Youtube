import express from "express";
import session from 'express-session';
import './config/passport.js'; 
import passport from 'passport'; // Assuming you have a passport.js in a config folder
import cors from "cors";
import cookieParser from "cookie-parser";

// Route Imports
import userRouter from "./routes/user.routes.js";
import videoRouter from "./routes/video.routes.js";
import likeRouter from "./routes/like.routes.js";
import commentRouter from "./routes/comment.routes.js";

const app = express();

// --- CORRECT MIDDLEWARE ORDER ---

// 1. CORS should be first to handle pre-flight requests
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

// 2. Standard middleware for parsing JSON, URL-encoded data, and cookies
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// 3. Session and Passport middleware (MUST be in this order)
app.use(session({
    secret: process.env.SESSION_SECRET, // Use an environment variable for your secret
    resave: false,
    saveUninitialized: false, // Set to false
    cookie: {
        secure: process.env.NODE_ENV === 'production', // false for HTTP, true for HTTPS
        httpOnly: true,

    }
}));

app.use(passport.initialize());
app.use(passport.session());

// 4. Routes should be last
app.use("/api/v1/users", userRouter);
app.use("/api/v1/videos", videoRouter);
app.use("/api/v1/likes", likeRouter);
app.use("/api/v1/comments", commentRouter);

export { app };