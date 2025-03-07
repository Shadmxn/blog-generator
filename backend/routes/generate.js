const express = require("express");
const router = express.Router();
const OpenAI = require("openai");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post("/generate", async (req, res) => {
  try {
    const { topic } = req.body;
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a professional blog writer. Write engaging, informative, natural, and easy-to-read blog posts for a general audience.",
        },
        {
          role: "user",
          content: `Write a well-structured blog post about '${topic}' in a natural flow without explicit subheadings like "Introduction" or "Conclusion". Instead, make it flow seamlessly with smooth transitions. Use a professional yet conversational tone.`,
        },
      ],
      max_tokens: 1000,
    });

    res.json({ content: response.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
