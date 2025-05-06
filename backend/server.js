require("dotenv").config();
const express = require("express");
const cors = require("cors");
const generateRoute = require("./routes/generate");
const cron = require("node-cron");
const axios = require("axios");

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);
app.use("/api", generateRoute);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () =>
  console.log(`Backend running on http://localhost:${PORT}`)
);

const userRoutes = require("./api/users/users.routes");

app.use("/api/users", userRoutes);

const listBlogsRoute = require("./routes/listBlogs");
app.use("/api", listBlogsRoute);

const blogTopics = [
  "Top Tips for Budgeting in 2025",
  "How to Track Expenses Like a Pro",
  "Smart Ways to Save Money Every Month",
  "The Psychology Behind Overspending",
  "Best Budgeting Apps Compared",
  "Creating a Personal Finance Plan That Works",
  "Top Financial Mistakes to Avoid in Your 20s",
  "How to Set and Stick to a Grocery Budget",
  "Emergency Funds: Why You Need One",
  "How to Reduce Subscription Costs Easily",
];

let topicIndex = 0;

// cron.schedule("*/10 * * * *", async () => {
//   const topic = blogTopics[topicIndex % blogTopics.length];
//   topicIndex++;

//   console.log("⏰ Cron job triggered with topic:", topic);

//   try {
//     const response = await axios.post("http://localhost:5001/api/generate", {
//       topic,
//       reference: "",
//     });

//     console.log("✅ Blog generated:", response.data.title);
//   } catch (err) {
//     console.error("❌ Error generating blog:", err.message);
//   }
// });
