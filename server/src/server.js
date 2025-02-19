import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./db/db.js";
import adminRoutes from "./routes/AdminRoutes.js";
import companyRoutes from "./routes/CompanyRoutes.js";
import reportRoutes from "./routes/ReportRoutes.js";
import trainerSourcerRoutes from "./routes/TrainerSourcerRoutes.js";
import trainerRoutes from "./routes/TrainerRoutes.js";
import projectRoutes from "./routes/ProjectRoutes.js";
import domainRoutes from "./routes/DomainRoutes.js";
import azureRoutes from "./routes/azureRoutes.js";
import helmet from "helmet";
import azureBlobRoutes from "./routes/azureBlobRoutes.js";
import jwt from "jsonwebtoken";
import morgan from "morgan";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const PORT = process.env.PORT || 4000;
const app = express();

// Use Helmet for securing HTTP headers
app.use(helmet());

// Helmet configuration
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: [
                "'self'",
                "trusted.com",
                "http://localhost:5173",
                "http://localhost:5174",
                "http://bas.rjpinfotek.com:5173",
                "http://bas.rjpinfotek.com:5174",
                "http://10.0.0.4:5173",
                "http://10.0.0.4:5174",
                "http://0.0.0.0:5173",
                "http://0.0.0.0:5174",
            ],
            objectSrc: ["'none'"],
            upgradeInsecureRequests: [],
        },
    })
);
app.use(helmet.noSniff());
app.use(helmet.frameguard({ action: "deny" }));
app.use(helmet.xssFilter());
app.use(
    helmet.hsts({
        maxAge: 31536000 * 100, // One year in seconds
        includeSubDomains: true,
    })
);
app.use(helmet.referrerPolicy({ policy: "no-referrer" }));

if (process.env.NODE_ENV === "production") {
    app.use(helmet());
} else {
    app.use(
        helmet({
            contentSecurityPolicy: false, // Disable CSP for development
        })
    );
}

// Get the current file's directory
const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware to log the absolute request path
app.use((req, res, next) => {
    const absolutePath = path.resolve(__dirname, req.path);
    next();
});

// Request Logging
const logStream = fs.createWriteStream(path.join(process.cwd(), "access.log"), {
    flags: "a", // Append mode
});
app.use(morgan("combined", { stream: logStream }));

// CORS configuration
const corsOptions = {
    origin: [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://bas.rjpinfotek.com:5173",
        "http://bas.rjpinfotek.com:5174",
        "http://10.0.0.4:5173",
        "http://10.0.0.4:5174",
        "http://0.0.0.0:5173",
        "http://0.0.0.0:5174",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Connect to MongoDB
connectDB();


app.use((req, res, next) => {
    next();
});

// Routes
app.get("/", (req, res) => res.send("Hii, Good Request !!!"));
app.use("/api/employee", adminRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/trainersourcer", trainerSourcerRoutes);
app.use("/api/trainer", trainerRoutes);
app.use("/api/resumeextractor", azureRoutes);
app.use("/api/filestorage", azureBlobRoutes);
app.use("/api/project", projectRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/domains", domainRoutes);


// Utility to handle async errors
const asyncHandler = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(`[ERROR] ${err.message}`); // Log error stack for debugging
    const statusCode = err.status || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on ${PORT}`);
});