const express = require("express");
const router = express.Router();

const Log = require("../../logging_middleware/logger");
const { token } = require("../../logging_middleware/config/token");

// 🔥 EXACT SAME PATH AS DOCUMENT
router.post("/evaluation-service/logs", async (req, res) => {
    try {
        const { stack, level, package: pkg, message } = req.body;

        const result = await Log(stack, level, pkg, message, token);

        // 🔥 PRINT IN TERMINAL
        console.log("📥 REQUEST BODY:");
        console.log(req.body);

        console.log("📤 RESPONSE:");
        console.log(result);

        // ✅ send exact response
        return res.status(200).json(result);

    } catch (err) {
        console.log("❌ ERROR:", err.message);

        return res.status(500).json({
            error: "Internal Server Error"
        });
    }
});

module.exports = router;