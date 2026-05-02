const express = require("express");
const router = express.Router();

const Log = require("../../logging_middleware/logger");
const { token } = require("../../logging_middleware/config/token");

// 🔥 EXACT behavior as document
router.get("/", async (req, res) => {

    const result = await Log(
        "backend",
        "error",
        "handler",
        "received string, expected bool",
        token
    );

    // ✅ send EXACT response
    return res.status(200).json(result);
});

module.exports = router;