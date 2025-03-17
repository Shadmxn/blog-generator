const express = require("express");
const router = express.Router();
const OpenAI = require("openai");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post("/generate", async (req, res) => {
  try {
    const { topic, reference } = req.body;

    let referenceText = reference.trim()
      ? `Use the following reference blog to match style and structure:\n\n${reference}`
      : "";

    const blogResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are an expert blog writer. Write engaging, structured, and high-quality blog posts with proper paragraph spacing. Do not use markdown formatting or explicit headings like 'Introduction' or 'Conclusion'.",
        },
        {
          role: "user",
          content: `Write a high-quality blog post about '${topic}'. 
          ${referenceText}

          - The blog should always begin with a strong opening paragraph.
          - Identify key sections (such as a list in 'Top 5 Cars').
          - Insert placeholders like [IMAGE: Section Title] where an image should appear.
          - Ensure natural paragraph breaks and a structured flow.`,
        },
      ],
      max_tokens: 1500,
    });

    let blogContent = blogResponse.choices[0].message.content;

    // ✅ Generate the header image first (featured image)
    const featuredImageResponse = await openai.images.generate({
      model: "dall-e-3",
      prompt: `A clean, modern, and visually engaging image representing '${topic}'.`,
      n: 1,
      size: "1024x1024",
      style: "natural",
    });

    const featuredImageUrl = featuredImageResponse.data[0].url; // ✅ Ensure this is included in response

    // Extract section titles where images should be placed
    const sectionTitles = [...blogContent.matchAll(/\[IMAGE: (.*?)\]/g)].map(
      (match) => match[1]
    );

    let imageUrls = {};
    for (const title of sectionTitles) {
      try {
        const imageResponse = await openai.images.generate({
          model: "dall-e-3",
          prompt: `A clean, modern, and realistic image representing '${title}'`,
          n: 1,
          size: "1024x1024",
          style: "natural",
        });
        imageUrls[title] = imageResponse.data[0].url;
      } catch (imageError) {
        console.error(`Failed to generate image for: ${title}`, imageError);
      }
    }

    // Replace placeholders with actual image HTML
    for (const title in imageUrls) {
      blogContent = blogContent.replace(
        `[IMAGE: ${title}]`,
        `<img src="${imageUrls[title]}" alt="${title}" class="blog-img-in-p"/>`
      );
    }

    blogContent = `<p>${blogContent.replace(/\n/g, "</p><p>")}</p>`;

    res.json({ content: blogContent, featuredImage: featuredImageUrl }); // ✅ Ensure this is sent
  } catch (error) {
    console.error("Error in /generate route:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
