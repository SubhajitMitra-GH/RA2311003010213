const express = require("express");
const app = express();

const testRoute = require("./routes/testRoutes");

app.use(express.json());

app.use("/test", testRoute);

app.listen(3000, () => {
    console.log("Server running on port 3000");
});