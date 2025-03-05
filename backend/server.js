require("dotenv").config();
const express = require("express");
const cors = require("cors");
const generateRoute = require("./routes/generate");

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api", generateRoute);

app.listen(5000, () => console.log("Backend running on http://localhost:5000"));
