"use client";
import { useState } from "react";
import axios from "axios";
import BlogPreview from "@/components/BlogPreview";

export default function Home() {
  const [topic, setTopic] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const generateBlog = async () => {
    setLoading(true);
    try {
      console.log("Generate button clicked!");
      const res = await axios.post("http://localhost:5001/api/generate", {
        topic,
      });
      console.log("API Response:", res.data);

      // ✅ Format the content to break into paragraphs
      const formattedContent = res.data.content
        .split("\n\n") // Splits based on double newlines (paragraphs)
        .map((para) => `<p>${para.trim()}</p>`) // Wraps each in <p>
        .join(""); // Joins them as a single string

      setContent(formattedContent);
    } catch (error) {
      console.error("Error generating blog:", error);
    }
    setLoading(false);
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
        style={{
          padding: "10px",
          marginRight: "10px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          cursor: "pointer",
          borderRadius: "5px",
        }}
        disabled={loading} // ✅ Disable button while loading
      >
        {loading ? "Generating..." : "Generate"}
      </button>
      <BlogPreview title={topic} content={content} />
    </div>
  );
}
