// backend/routes/listBlogs.js
const express = require("express");
const { S3Client, ListObjectsV2Command } = require("@aws-sdk/client-s3");
const router = express.Router();

const s3 = new S3Client({ region: "us-east-1" });

router.get("/blogs", async (req, res) => {
  try {
    const command = new ListObjectsV2Command({
      Bucket: "blog-ai-bucket",
      Prefix: "",
    });

    const data = await s3.send(command);

    const blogs = data.Contents.filter((obj) => obj.Key.endsWith(".html")).map(
      (obj) => ({
        name: obj.Key,
        url: `https://blog-ai-bucket.s3.amazonaws.com/${obj.Key}`,
      })
    );

    res.json(blogs);
  } catch (err) {
    console.error("Failed to list S3 files:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
