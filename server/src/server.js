import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./db/db.js";
import adminRoutes from "./routes/AdminRoutes.js";
import companyRoutes from "./routes/CompanyRoutes.js";
import trainerSourcerRoutes from "./routes/TrainerSourcerRoutes.js";
import trainerRoutes from "./routes/TrainerRoutes.js";
import azureRoutes from "./routes/azureRoutes.js";
import http from "http";
import azureBlobRoutes from "./routes/azureBlobRoutes.js";

dotenv.config();

const PORT = process.env.PORT || 4000;
const app = express();

const corsOptions = {
    origin: ["http://localhost:5173", "http://localhost:5174"],
    optionsSuccessStatus: 200,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Connect to MongoDB
connectDB();

// Routes
app.get("/", (req, res) => res.send("Hii, Good Request !!!"));
app.use("/api/employee", adminRoutes);
app.use("/api/company", companyRoutes); // Added for company routes
app.use("/api/trainersourcer", trainerSourcerRoutes);
app.use("/api/trainer", trainerRoutes);
app.use("/api/resumeextractor", azureRoutes); // Azure routes for checking connection and file upload
app.use("/api/filestorage", azureBlobRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});