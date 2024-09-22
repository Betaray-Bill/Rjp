import express from "express";
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser';
import connectDB from "./db/db.js";
import adminRoutes from "./routes/AdminRoutes.js"
import trainerSourcerRoutes from "./routes/TrainerSourcerRoutes.js"
import trainerRoutes from "./routes/TrainerRoutes.js"

dotenv.config()

const PORT = process.env.PORT
const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = {
    origin: ["http://localhost:5173"], //(https://your-client-app.com)
    optionsSuccessStatus: 200,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));


// Connect to MongoDB
connectDB()

// Routes
app.get("/", (req, res) => {
    console.log(":")
    res.send("Hii, Good Request !!!")
})


app.use("/api/employee", adminRoutes)
app.use("/api/trainersourcer", trainerSourcerRoutes)
app.use("/api/trainer", trainerRoutes)


// PORT 
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});