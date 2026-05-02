const axios = require("axios");

// 🔐 Automatically using your token from config
const { token: TOKEN } = require("../logging_middleware/config/token");

async function getNotifications() {
    try {
        const response = await axios.get(
            "http://20.207.122.201/evaluation-service/notifications",
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                },
            }
        );

        // ✅ Return only notifications array
        return response.data.notifications;

    } catch (error) {
        console.error(
            "Error:",
            error.response?.data || error.message
        );
    }
}

// ▶️ RUN
(async () => {
    const data = await getNotifications();
    console.log(data);
})();