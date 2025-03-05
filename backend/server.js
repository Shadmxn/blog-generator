require("dotenv").config();
const express = require("express");
const cors = require("cors");
const generateRoute = require("./routes/generate");

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api", generateRoute);

const PORT = process.env.PORT || 5001; // Use 5001 instead of 5000
app.listen(PORT, () =>
  console.log(`Backend running on http://localhost:${PORT}`)
);
