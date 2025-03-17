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
            "You are an expert blog writer. Generate a unique, engaging blog title based on the given topic, followed by a long, structured, and high-quality blog post with proper paragraph spacing. Make it SEO friendly.",
        },
        {
          role: "user",
          content: `Generate a unique and engaging blog title for a blog about '${topic}', then write a high-quality blog post about it.
  ${referenceText}

  - The blog title should be creative and attention-grabbing, not just a repetition of the topic.
  - The blog should always begin with a strong opening paragraph.
  - Identify key sections.
  - Use proper HTML headings (<h2>, <h3>, etc.) for section titles. DO NOT use markdown (###).
  - Insert placeholders like [IMAGE: Section Title] where an image should appear.
  - Ensure natural paragraph breaks and a structured flow.
  
  The response should be in the following format:
  **Title:** [Generated Blog Title]
  **Content:** [Full Blog Content in valid HTML format with <h2>, <h3>, <p>, etc.]`,
        },
      ],
      max_tokens: 2000,
    });

    const blogText = blogResponse.choices[0].message.content;

    // ✅ Extract the title using regex
    const titleMatch = blogText.match(/\*\*Title:\*\* (.+)/);
    const title = titleMatch ? titleMatch[1] : topic; // Use topic if title is missing

    // ✅ Extract the content after "Content:"
    const contentMatch = blogText.match(/\*\*Content:\*\*([\s\S]*)/);
    let blogContent = contentMatch ? contentMatch[1].trim() : blogText;

    // console.log("Generated Title:", title);
    // console.log("Generated Content:", blogContent);

    const featuredImageResponse = await openai.images.generate({
      model: "dall-e-3",
      prompt: `A clean, modern, and visually engaging wide-format image representing '${topic}'. The image should be visually appealing and fit as a blog header.`,
      n: 1,
      size: "1792x1024",
      style: "natural",
    });

    const featuredImageUrl = featuredImageResponse.data[0].url;

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

        imageUrls[title] = imageResponse.data[0].url;
      } catch (imageError) {
        console.error(`Failed to generate image for: ${title}`, imageError);
      }
    }

    for (const title in imageUrls) {
      const imageTag = `<img src="${imageUrls[title]}" alt="${title}" class="blog-img-in-p"/>`;
      blogContent = blogContent.replace(`[IMAGE: ${title}]`, imageTag);
    }

    blogContent = `<p>${blogContent.replace(/\n/g, "</p><p>")}</p>`;

    res.json({ title, content: blogContent, featuredImage: featuredImageUrl });
  } catch (error) {
    console.error("Error in /generate route:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
