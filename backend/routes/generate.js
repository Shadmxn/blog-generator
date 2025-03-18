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
</CONTENT>
`,
        },
      ],
      max_tokens: 2500,
    });

    const blogText = blogResponse.choices[0].message.content;

    const titleMatch = blogText.match(/<TITLE>(.+?)<\/TITLE>/);

    let title = titleMatch ? titleMatch[1].trim() : "";

    if (title.startsWith('"') && title.endsWith('"')) {
      title = title.slice(1, -1); // Remove surrounding quotes if present
    }

    if (!title) {
      console.warn(
        "Warning: No unique title generated, using topic as fallback."
      );
      title = topic; // Fallback to topic only if AI fails
    }

    // ✅ Extract the content after "Content:"
    const contentMatch = blogText.match(/<CONTENT>([\s\S]*)<\/CONTENT>/);

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
