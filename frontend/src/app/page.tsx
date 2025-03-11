"use client";
import { useState } from "react";
import axios from "axios";
import BlogPreview from "@/components/BlogPreview";

export default function Home() {
  const [topic, setTopic] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const generateBlog = async () => {
    setLoading(true);
    try {
      console.log("Generating blog and image...");
      const res = await axios.post("http://localhost:5001/api/generate", {
        topic,
      });
      console.log("API Response:", res.data);

      const formattedContent = res.data.content
        .split("\n\n")
        .map((para) => `<p style="margin-bottom: 16px;">${para.trim()}</p>`)
        .join("");
      setContent(formattedContent);
      setImageUrl(res.data.imageUrl);
    } catch (error) {
      console.error("Error generating blog:", error);
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "Arial",
        maxWidth: "800px",
        margin: "auto",
      }}
    >
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
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          cursor: "pointer",
          borderRadius: "5px",
        }}
        disabled={loading}
      >
        {loading ? "Generating Blog..." : "Generate Blog"}
      </button>

      {loading && (
        <p style={{ marginTop: "10px", color: "#555" }}>
          ⏳ Generating blog and image, please wait...
        </p>
      )}

      <BlogPreview title={topic} content={content} imageUrl={imageUrl} />
    </div>
  );
}
