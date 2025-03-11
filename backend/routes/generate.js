const express = require("express");
const router = express.Router();
const OpenAI = require("openai");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post("/generate", async (req, res) => {
  try {
    const { topic } = req.body;

    const blogResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are an expert blog writer. Write engaging, informative, and structured blog posts.",
        },
        {
          role: "user",
          content: `Write a high-quality blog post about '${topic}'. Use natural transitions, bullet points where necessary without using **, and an engaging tone. Avoid using explicit subheadings like 'Introduction' or 'Conclusion'. Do not use any emoji's within the text.`,
        },
      ],
      max_tokens: 1000,
    });

    const blogContent = blogResponse.choices[0].message.content;

    const imageResponse = await openai.images.generate({
      model: "dall-e-3",
      prompt: `A high-quality blog cover image for an article about '${topic}', professional and engaging.`,
      n: 1,
      size: "1024x1024",
    });

    const imageUrl = imageResponse.data[0].url;

    res.json({ content: blogContent, imageUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
