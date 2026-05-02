const express = require("express");
const axios = require("axios");

const app = express();

// 🔐 Automatically using your token from config
const { token: TOKEN } = require("../logging_middleware/config/token");

// 🔹 Priority mapping
const getPriority = (type) => {
    if (type === "Placement") return 3;
    if (type === "Result") return 2;
    return 1; // Event
};

// 🔹 Fetch notifications
const fetchNotifications = async () => {
    const response = await axios.get(
        "http://20.207.122.201/evaluation-service/notifications",
        {
            headers: {
                Authorization: `Bearer ${TOKEN}`,
            },
        }
    );
    return response.data.notifications;
};
app.get("/notifications", async (req, res) => {
    try {
        const response = await axios.get(
            "http://20.207.122.201/evaluation-service/notifications",
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                },
            }
        );

        return res.json(response.data);

    } catch (error) {
        return res.status(500).json({
            error: error.response?.data || error.message,
        });
    }
});

// 🔥 MAIN API: /notifications/priority
app.get("/notifications/priority", async (req, res) => {
    try {
        const n = parseInt(req.query.n) || 10;

        const notifications = await fetchNotifications();

        // 🔥 SORT: priority first, then latest
        const sorted = notifications.sort((a, b) => {
            if (getPriority(b.Type) !== getPriority(a.Type)) {
                return getPriority(b.Type) - getPriority(a.Type);
            }
            return new Date(b.Timestamp) - new Date(a.Timestamp);
        });

        // 🔥 TAKE TOP N
        const result = sorted.slice(0, n);

        return res.json({
            count: result.length,
            notifications: result,
        });

    } catch (error) {
        return res.status(500).json({
            error: error.response?.data || error.message,
        });
    }
});

// start server
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});