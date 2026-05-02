const express = require("express");
const crypto = require("crypto");

const router = express.Router();

// Mock database (in-memory) to make it work in Postman instantly
let notificationsDb = [];

// 1. Send Notification (POST)
router.post("/notifications", (req, res) => {
    try {
        const { userId, type, message } = req.body;

        if (!userId || !type || !message) {
            return res.status(400).json({ error: "Missing required fields: userId, type, message" });
        }

        const newNotification = {
            id: crypto.randomUUID(),
            userId,
            type,
            message,
            isRead: false,
            createdAt: new Date().toISOString()
        };

        notificationsDb.push(newNotification);

        return res.status(201).json({
            id: newNotification.id,
            status: "sent",
            notification: newNotification // Extra info for debugging in Postman
        });
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

// 2. Get Notifications (GET)
router.get("/notifications", (req, res) => {
    try {
        const { userId } = req.query;

        let userNotifications = notificationsDb;
        
        // Filter by userId if query param is passed (e.g., ?userId=123)
        if (userId) {
            userNotifications = notificationsDb.filter(n => n.userId === userId);
        }

        return res.status(200).json({
            count: userNotifications.length,
            notifications: userNotifications
        });
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

// 3. Mark Notification as Read (PUT)
router.put("/notifications/:id/read", (req, res) => {
    try {
        const { id } = req.params;
        
        const notification = notificationsDb.find(n => n.id === id);
        
        if (!notification) {
            return res.status(404).json({ error: "Notification not found" });
        }

        notification.isRead = true;

        return res.status(200).json({
            id: notification.id,
            status: "read",
            notification
        });
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

// 4. Delete Notification (DELETE)
router.delete("/notifications/:id", (req, res) => {
    try {
        const { id } = req.params;

        const initialLength = notificationsDb.length;
        notificationsDb = notificationsDb.filter(n => n.id !== id);

        if (notificationsDb.length === initialLength) {
            return res.status(404).json({ error: "Notification not found" });
        }

        return res.status(200).json({
            message: `Notification ${id} successfully deleted`
        });
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
