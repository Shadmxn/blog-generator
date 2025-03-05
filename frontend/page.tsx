"use client";
import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [topic, setTopic] = useState("");
  const [content, setContent] = useState("");

  const generateBlog = async () => {
    const res = await axios.post("/api/generate", { topic });
    setContent(res.data.content);
  };

  const exportToHTML = () => {
    const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${topic}</title>
            <link rel="stylesheet" href="styles.css">
        </head>
        <body>
            <article>
                <h1>${topic}</h1>
                <div>${content.replace(/\n/g, "<br>")}</div>
            </article>
        </body>
        </html>`;

    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "blog.html";
    a.click();
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>AI Blog Generator</h1>
      <input
        type="text"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="Enter blog topic"
        style={{ padding: "10px", width: "100%", marginBottom: "10px" }}
      />
      <button
        onClick={generateBlog}
        style={{ padding: "10px", marginRight: "10px" }}
      >
        Generate
      </button>
      <button onClick={exportToHTML} style={{ padding: "10px" }}>
        Export to HTML
      </button>
      <div
        style={{ marginTop: "20px", padding: "10px", border: "1px solid #ddd" }}
      >
        <h2>{topic}</h2>
        <p>{content}</p>
      </div>
    </div>
  );
}
