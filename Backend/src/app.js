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
import subscriptionRouter from "./routes/subscription.routes.js";
import searchRouter from "./routes/search.routes.js";

const app = express();

// --- CORRECT MIDDLEWARE ORDER ---

// 1. CORS should be first to handle pre-flight requests
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

// 2. Standard middleware for parsing JSON, URL-encoded data, and cookies
app.use(express.json({ limit: "16mb" }));
app.use(express.urlencoded({ extended: true, limit: "16mb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Debug middleware to log all requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

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
app.use("/api/v1/subscriptions", subscriptionRouter);
app.use("/api/v1/search", searchRouter);

// 5. Global Error Handler
app.use((err, req, res, next) => {
    console.error("API ERROR:", err);
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    
    res.status(statusCode).json({
        success: false,
        message,
        errors: err.errors || [],
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

export { app };