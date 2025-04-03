import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
  },
});

export default async function handler(req, res) {
  try {
    const command = new ListObjectsV2Command({
      Bucket: "blog-ai-bucket",
      Prefix: "", // Or 'blogs/' if you want only blog files
    });

    const data = await s3.send(command);

    const blogFiles =
      data.Contents?.filter((f) => f.Key.endsWith(".html")) || [];

    const urls = blogFiles.map((file) => ({
      key: file.Key,
      url: `https://blog-ai-bucket.s3.amazonaws.com/${file.Key}`,
    }));

    res.status(200).json({ blogs: urls });
  } catch (error) {
    console.error("S3 List Error:", error);
    res.status(500).json({ error: "Failed to fetch blog list" });
  }
}
