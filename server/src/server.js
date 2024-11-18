import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./db/db.js";
import adminRoutes from "./routes/AdminRoutes.js";
import companyRoutes from "./routes/CompanyRoutes.js";
import trainerSourcerRoutes from "./routes/TrainerSourcerRoutes.js";
import trainerRoutes from "./routes/TrainerRoutes.js";
import projectRoutes from "./routes/ProjectRoutes.js"
import azureRoutes from "./routes/azureRoutes.js";
import http from "http";
import azureBlobRoutes from "./routes/azureBlobRoutes.js";
import puppeteer from 'puppeteer';
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

// to pdf


const generatePDF = async(req, res) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    // const element = req.body
    // console.log(element)

    // Load the HTML content (you can replace this with a URL or a local file)
    await page.setContent('<html><body><h1>Resume</h1></body></html>', {
        waitUntil: "domcontentloaded",
    });

    // Generate PDF
    const a = await page.pdf({
        path: "resume.pdf", // Output path
        format: "A4", // Paper size
        printBackground: true, // Include background colors and images
    });
    console.log(a)

    await browser.close();

    // retrures.status(200).json({
    //     message: "Successfully Download PDF",
    //     pdfPath: "resume.pdf", // Path to the generated PDF file
    // });
    // console.log(object)
};

// app.get("/generatePDF", generatePDF);

// generatePDF();

// Routes
app.get("/", (req, res) => res.send("Hii, Good Request !!!"));
app.use("/api/employee", adminRoutes);
app.use("/api/company", companyRoutes); // Added for company routes
app.use("/api/trainersourcer", trainerSourcerRoutes);
app.use("/api/trainer", trainerRoutes);
app.use("/api/resumeextractor", azureRoutes); // Azure routes for checking connection and file upload
app.use("/api/filestorage", azureBlobRoutes);
app.use("/api/project", projectRoutes)


// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});