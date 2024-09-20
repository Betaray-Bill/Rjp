import express from "express";
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import connectDB from "./db/db.js";
import adminRoutes from "./routes/AdminRoutes.js"
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
    console.log(":")
    res.send("Hii, Good Request !!!")
})

app.use("/api/employee", adminRoutes)


// PORT 
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});