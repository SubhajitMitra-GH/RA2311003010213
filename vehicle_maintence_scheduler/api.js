const axios = require("axios");

const BASE_URL = "http://20.207.122.201/evaluation-service";

// 🔐 IMPORTANT: use your token here
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJzbTkxOTlAc3JtaXN0LmVkdS5pbiIsImV4cCI6MTc3NzcwNTQzNiwiaWF0IjoxNzc3NzA0NTM2LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiNTI0OTI3ZDctZmM2ZC00NjI2LWJiNWYtNDFlNGE5NGZhODE0IiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoic3ViaGFqaXQgbWl0cmEiLCJzdWIiOiIxNmU0MGU0OC1jZWIxLTRmOWMtYjBkYS0wN2M2YjQ4YzdkYTIifSwiZW1haWwiOiJzbTkxOTlAc3JtaXN0LmVkdS5pbiIsIm5hbWUiOiJzdWJoYWppdCBtaXRyYSIsInJvbGxObyI6InJhMjMxMTAwMzAxMDIxMyIsImFjY2Vzc0NvZGUiOiJRa2JweEgiLCJjbGllbnRJRCI6IjE2ZTQwZTQ4LWNlYjEtNGY5Yy1iMGRhLTA3YzZiNDhjN2RhMiIsImNsaWVudFNlY3JldCI6IkhKZmdCRFBQd3NmTlhWWWMifQ.KL-NipIrIl1KVeaiffhDq8x4gKrLDTp93UucmAZjT-Q"

const headers = {
    Authorization: `Bearer ${TOKEN}`,
};

const getDepots = async () => {
    const res = await axios.get(`${BASE_URL}/depots`, { headers });
    return res.data.depots;
};

const getVehicles = async () => {
    const res = await axios.get(`${BASE_URL}/vehicles`, { headers });
    return res.data.vehicles;
};

module.exports = { getDepots, getVehicles };