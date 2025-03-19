const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const mainRouter = require("./routers/mainRouter");
require("dotenv").config();

const app = express();

// Define front-end origins for local and production environments
const localFrontEnd = "http://localhost:5175";
const productionFrontEnd = "https://final-task-front.onrender.com"; // Update to front-end domain

// MongoDB connection
mongoose
    .connect(process.env.MONGO_KEY)
    .then(() => {
        console.log("DB connect success");
    })
    .catch((err) => {
        console.error("DB connection error:", err);
    });

// Middleware setup for Express.js
app.use(
    cors({
        origin: [localFrontEnd, productionFrontEnd], // Allow both local and production
        credentials: true, // Allow cookies or authentication if needed
    })
);

app.use(express.json());
app.use("/", mainRouter);

// Use the environment variable PORT or default to 2000
const PORT = process.env.PORT || 2000;

// Start Express server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
