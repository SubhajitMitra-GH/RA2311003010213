const axios = require("axios");

const LOG_API = "http://20.207.122.201/evaluation-service/logs";

const Log = async (stack, level, packageName, message, token) => {
    try {
        const response = await axios.post(
            LOG_API,
            {
                stack,
                level,
                package: packageName,
                message
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        );

        console.log("Log sent:", response.data);
    } catch (err) {
        console.error("Logging failed:", err.message);
    }
};

module.exports = Log;