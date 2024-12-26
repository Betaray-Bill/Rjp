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
import projectRoutes from "./routes/ProjectRoutes.js"
import azureRoutes from "./routes/azureRoutes.js";
import helmet from "helmet";
import azureBlobRoutes from "./routes/azureBlobRoutes.js";
dotenv.config();

const PORT = process.env.PORT || 4000;
const app = express();

// Use Helmet for securing HTTP headers
app.use(helmet())

// Helmet configuration
app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", 'trusted.com', "http://localhost:5173", "http://localhost:5174", ],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: []
    }
}));
app.use(helmet.noSniff());
app.use(helmet.frameguard({ action: 'deny' }));
app.use(helmet.xssFilter());
app.use(helmet.hsts({
    maxAge: 31536000 * 100, // One year in seconds
    includeSubDomains: true
}));
app.use(helmet.referrerPolicy({ policy: 'no-referrer' }));

if (process.env.NODE_ENV === 'production') {
    app.use(helmet());
} else {
    app.use(helmet({
        contentSecurityPolicy: false // Disable CSP for development
    }));
}

const corsOptions = {
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
};

// Log requests for debugging
app.use((req, res, next) => {
    console.log(`Request Origin: ${req.headers.origin}`);
    console.log(`Request Method: ${req.method}`);
    next();
});


app.use(cors(corsOptions));
// app.options("*", cors(corsOptions)); // Allow preflight requests for all routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Connect to MongoDB
connectDB();

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
app.use("/api/reports", reportRoutes)


app.use((err, req, res, next) => {
    console.error(err.stack); // Log the error for debugging

    const statusCode = err.status || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal Server Error',
    });
});



// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});










// const { EmailClient } = require("@azure/communication-email");

// const connectionString = "endpoint=https://rjpemail.india.communication.azure.com/;accesskey=Epn13P4r80FdmTyMCdha57HeLnn9K4qHPvJknNVZ0Uiw1uaIjrSyJQQJ99AKACULyCpYBCSUAAAAAZCSZ9oX";
// const client = new EmailClient(connectionString);

// async function main() {
//     const emailMessage = {
//         senderAddress: "DoNotReply@<from_domain>",
//         content: {
//             subject: "Test Email",
//             plainText: "Hello world via email.",
//             html: `
// 			<html>
// 				<body>
// 					<h1>Hello world via email.</h1>
// 				</body>
// 			</html>`,
//         },
//         recipients: {
//             to: [{ address: "<to_email>" }],
//         },

//     };

//     const poller = await client.beginSend(emailMessage);
//     const result = await poller.pollUntilDone();
// }

// main();