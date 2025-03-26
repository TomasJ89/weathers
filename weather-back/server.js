const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const mainRouter = require("./routers/mainRouter");
require("dotenv").config();

const app = express();

// Define front-end origins for local and production environments
const localFrontEnd = "http://localhost:5173";
const productionFrontEnd = "https://myweather-frontend.1tggzg5ms3kd.eu-de.codeengine.appdomain.cloud" // Update to front-end domain

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
        origin: [localFrontEnd, productionFrontEnd],
        credentials: true, // Allow cookies or authentication if needed
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    })
);

// Handle preflight requests properly
app.options("*", cors());

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Server runningsss! 🌍");
});

app.use("/", mainRouter);

// Use the environment variable PORT or default to 3000
const PORT = process.env.PORT || 3000;

// Start Express server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
