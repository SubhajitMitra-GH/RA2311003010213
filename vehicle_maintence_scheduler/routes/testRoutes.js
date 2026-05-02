const express = require("express");
const router = express.Router();

const Log = require("../../logging_middleware/logger");
const { token } = require("../../logging_middleware/config/token");

router.get("/", async (req, res) => {

    try {
        // 1️⃣ Route hit log
        await Log("backend", "info", "route", "Test route accessed", token);

        // 2️⃣ Debug log
        await Log("backend", "debug", "service", "Starting validation", token);

        const valid = req.query.valid;

        // 3️⃣ Validation check
        if (valid !== "true") {
            await Log("backend", "error", "handler", "Invalid input provided", token);

            return res.status(400).json({
                success: false,
                message: "Validation failed"
            });
        }

        // 4️⃣ DB operation log
        await Log("backend", "info", "repository", "Fetching data from DB", token);

        // Simulate DB failure
        if (req.query.fail === "db") {
            throw new Error("Database connection failed");
        }

        // 5️⃣ Success log
        await Log("backend", "info", "controller", "Data fetched successfully", token);

        return res.status(200).json({
            success: true,
            message: "Success"
        });

    } catch (err) {

        // 6️⃣ Fatal error log
        await Log("backend", "fatal", "db", err.message, token);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
});

module.exports = router;