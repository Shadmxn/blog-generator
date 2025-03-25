const fs = require("fs-extra");
const path = require("path");
const express = require("express");
const router = express.Router();
const OpenAI = require("openai");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");

const s3 = new S3Client({
  region: "us-east-1",
});

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Function to upload file to S3
const uploadToS3 = async (fileName, fileContent, contentType) => {
  const s3Params = {
    Bucket: "blog-ai-bucket",
    Key: fileName,
    Body: Buffer.from(fileContent, "utf-8"),
    ContentType: contentType,
    ACL: "public-read",
  };

  try {
    const uploadCommand = new PutObjectCommand(s3Params);
    await s3.send(uploadCommand);
    console.log(
      `✅ Uploaded to S3: https://blog-ai-bucket.s3.amazonaws.com/${fileName}`
    );
    return `https://blog-ai-bucket.s3.amazonaws.com/${fileName}`;
  } catch (err) {
    console.error("S3 Upload Error:", err);
    return null;
  }
};

const uploadImageFromUrl = async (imageUrl, nameHint = "image") => {
  try {
    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
    const buffer = Buffer.from(response.data, "binary");

    const extension = imageUrl.includes(".png") ? "png" : "jpg";
    const fileName = `images/${uuidv4()}-${nameHint}.${extension}`;

    const uploadCommand = new PutObjectCommand({
      Bucket: "blog-ai-bucket",
      Key: fileName,
      Body: buffer,
      ContentType: `image/${extension}`,
      ACL: "public-read",
    });

    await s3.send(uploadCommand);

    const s3Url = `https://blog-ai-bucket.s3.amazonaws.com/${fileName}`;
    console.log(`✅ Re-uploaded image to S3: ${s3Url}`);
    return s3Url;
  } catch (err) {
    console.error("❌ Failed to upload image from OpenAI:", err.message);
    return imageUrl; // fallback to original URL
  }
};

// Function to save blog files locally & upload to S3
const saveBlogFiles = async (title, content, featuredImageUrl) => {
  const date = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const slug = title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, ""); // Convert to slug
  const blogDir = path.join(__dirname, "../blogs"); // Save inside /blogs folder

  // Ensure the folder exists
  await fs.ensureDir(blogDir);

  // Define file paths
  const htmlFileName = `${date}-${slug}.html`;
  const jsonFileName = `${date}-${slug}.json`;
  const htmlFilePath = path.join(blogDir, htmlFileName);
  const jsonFilePath = path.join(blogDir, jsonFileName);

  // ✅ Prepare the blog HTML structure
  const blogHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="description" content="${title}">
        <title>${title}</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: auto; padding: 20px; }
            img { max-width: 100%; height: auto; margin: 20px 0; }
            h1, h2 { font-weight: bold; }
        </style>
    </head>
    <body>
        <h1>${title}</h1>
        <p><strong>Published on:</strong> ${date}</p>
        <img src="${featuredImageUrl}" alt="Header Image">
        ${content}
    </body>
    </html>
  `;

  // ✅ Prepare the metadata JSON file
  const blogMetadata = {
    title,
    slug,
    date,
    summary: "A brief summary of the blog goes here.",
    image: featuredImageUrl,
    url: `https://blog-ai-bucket.s3.amazonaws.com/${htmlFileName}`, // S3 URL
  };

  // ✅ Save locally
  await fs.writeFile(htmlFilePath, blogHtml, "utf8");
  await fs.writeJson(jsonFilePath, blogMetadata, { spaces: 2 });

  console.log(`✅ Blog saved locally: ${htmlFilePath}`);
  console.log(`✅ Metadata saved locally: ${jsonFilePath}`);

  // ✅ Upload both HTML and JSON files to S3
  const htmlUrl = await uploadToS3(htmlFileName, blogHtml, "text/html");
  const jsonUrl = await uploadToS3(
    jsonFileName,
    JSON.stringify(blogMetadata, null, 2),
    "application/json"
  );

  return { htmlUrl, jsonUrl }; // Return both URLs
};

// Main blog generation route
router.post("/generate", async (req, res) => {
  try {
    const { topic, reference = "" } = req.body;

    let referenceText = reference.trim()
      ? `Use the following reference blog to match style and structure:\n\n${reference}`
      : "";

    const blogResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are an expert blog writer. Generate a unique, engaging blog title based on the given topic, followed by a long, structured, and high-quality blog post with proper paragraph spacing. Make it SEO friendly.",
        },
        {
          role: "user",
          content: `Generate a unique and engaging blog title for a blog about '${topic}', then write a high-quality blog post about it.
          ${referenceText}
          
          - The blog title should be creative and attention-grabbing, not just a repetition of the topic.
          - The blog should always begin with a strong opening paragraph (but do NOT label it as "Introduction").
          - Identify key sections.
          - **Use proper HTML headings** (<h2>, <h3>, etc.) for section titles instead of Markdown (### or **bold text**).
          - The final paragraph should naturally conclude the blog but do NOT label it as "Conclusion."
          - Insert placeholders like [IMAGE: Section Title] where an image should appear.
          - Ensure natural paragraph breaks and a structured flow.
          - **The entire response must be in valid HTML format. DO NOT use Markdown.**
              
          The response should be in this format:
          <TITLE>[Generated Blog Title]</TITLE>

          <CONTENT>
          [Full Blog Content in valid HTML]
          </CONTENT>`,
        },
      ],
      max_tokens: 2500,
    });

    const blogText = blogResponse.choices[0].message.content;

    // ✅ Extract Title
    const titleMatch = blogText.match(/<TITLE>(.+?)<\/TITLE>/);
    let title = titleMatch ? titleMatch[1].trim() : topic; // Default to topic if title missing

    // ✅ Extract Blog Content
    const contentMatch = blogText.match(/<CONTENT>([\s\S]*)<\/CONTENT>/);
    let blogContent = contentMatch ? contentMatch[1].trim() : blogText;

    // ✅ Generate Featured Image
    const featuredImageResponse = await openai.images.generate({
      model: "dall-e-3",
      prompt: `A clean, modern, and visually engaging wide-format image representing '${topic}'. The image should be visually appealing and fit as a blog header.`,
      n: 1,
      size: "1792x1024",
      style: "natural",
    });

    const tempFeaturedImageUrl = featuredImageResponse.data[0].url;
    const featuredImageUrl = await uploadImageFromUrl(
      tempFeaturedImageUrl,
      "header"
    );

    // ✅ Generate Inline Images (Max 4)
    const maxImages = 4;
    const sectionTitles = [...blogContent.matchAll(/\[IMAGE: (.*?)\]/g)]
      .map((match) => match[1])
      .slice(0, maxImages);

    let imageUrls = {};
    for (const title of sectionTitles) {
      try {
        const imageResponse = await openai.images.generate({
          model: "dall-e-3",
          prompt: `A clean, modern, and visually appealing image representing '${title}'. The image should be clear and fit well beside text in a blog post.`,
          n: 1,
          size: "1024x1024",
          style: "natural",
        });

        const tempImageUrl = imageResponse.data[0].url;
        const s3ImageUrl = await uploadImageFromUrl(tempImageUrl, title);

        imageUrls[title] = s3ImageUrl;
      } catch (imageError) {
        console.error(`Failed to generate image for: ${title}`, imageError);
      }
    }

    // ✅ Replace placeholders like [IMAGE: Section Title]
    for (const title in imageUrls) {
      const imageTag = `<img src="${imageUrls[title]}" alt="${title}" class="blog-img-in-p"/>`;
      blogContent = blogContent.replace(`[IMAGE: ${title}]`, imageTag);
    }

    // ✅ Save Blog Files & Upload to S3
    const { htmlUrl, jsonUrl } = await saveBlogFiles(
      title,
      blogContent,
      featuredImageUrl
    );

    // ✅ Send Response
    res.json({
      title,
      content: blogContent,
      featuredImage: featuredImageUrl,
      htmlUrl,
      jsonUrl,
    });
  } catch (error) {
    console.error("Error in /generate route:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
