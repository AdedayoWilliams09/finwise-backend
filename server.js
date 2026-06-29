//purpose: main express server entry point

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";
import publicRoutes from './routes/publicRoutes.js';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import YAML from 'yaml';
import connectDB from "./config/db.js";

//load environment variables
dotenv.config();

//validate required environment variables
const requiredEnvVars = ["PORT", "MONGO_URI", "FRONTEND_URL"];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(` Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
}

//initialize express
const app = express();


// ============ SWAGGER DOCUMENTATION CONFIGURATION ============
try {
  const openapiFile = fs.readFileSync('./openapi.yaml', 'utf8');
  const swaggerDocument = YAML.parse(openapiFile);
  // Serve Swagger UI interface
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} catch (error) {
  console.warn(' Warning: Could not load openapi.yaml. Swagger UI setup skipped.', error.message);
}

//===============middleware in correct order================

//1. Security headers (helmet)
app.use(helmet());

//2. CORS - only allow frontend URL
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    optionsSuccessStatus: 200,
  }),
);

//3. HTTP request logging (dev mode only)
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//4. Rate limiting - 100 requests for 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false,
});
app.use("/api/", limiter);

//5. Body parsing middleware
app.use(express.json({ limit: "10mb" })); // Limit JSON body to 10MB
app.use(express.urlencoded({ extended: true, limit: "10mb" })); // Limit URL-encoded body to 10MB

// Public routes
app.use('/api/public', publicRoutes);

//===================health check ==============================
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    mongoConnected: mongoose.connection.readyState === 1, // 1 means connected
  });
});

//====================temporary test route ==============================
app.get("/api/test", (req, res) => {
    res.status(200).json({
        success: true,
        message: "API connection successful",
        data: { backendStatus: "healthy" }
    });
});

//====================================404 handler for undefined routes =================================
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`
    });

});

//=================================global error handler =========================================
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    //log for debugging
    console.error(`Error: ${message}`);

    //hide stack traces in production 
    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }) // include stack trace in dev mode
    });
});

//=======================start server only after DB connects ======================
const startServer = async () => {
    try {
        //connect to mongodb first 
        await connectDB();

        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log(`Environment: ${process.env.NODE_ENV}`);
            console.log(`Allowed frontend: ${process.env.FRONTEND_URL}`);
            console.log(`Health check: http://localhost:${PORT}/api/health`);
            console.log(`Test endpoint: http://localhost:${PORT}/api/test`);
        });
    } catch (error) {
        console.error(`Failed to start server: ${error.message}`);
        process.exit(1);
    }

};





startServer();


