import express from "express";
import dotenv from 'dotenv'
import mongoose from "mongoose";
import cookieParser from 'cookie-parser';
import cors from 'cors'
import connectDB from "./db/db.js";
dotenv.config()

const PORT = process.env.PORT
const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Connect to MongoDB
connectDB()

// Routes
app.get("/", (req, res) => {
    res.send("Hii, Good Request !!!")
})


// PORT 
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});