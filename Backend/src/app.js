import express from "express"
const app = express()

import cors from "cors"
import cookieParser from "cookie-parser"
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

app.get("/"  , (req,res) =>{
    res.send("Hello Devansh")

})

// Routes

import userRouter from "./routes/user.routes.js"
import videoRouter from "./routes/video.routes.js"


app.use("/api/v1/users", userRouter)
app.use("/api/v1/video" , videoRouter)
//http://localhost:8000/api/v1/users/register

export { app } 