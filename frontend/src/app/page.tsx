"use client";
import { useState } from "react";
import axios from "axios";
import BlogPreview from "@/components/BlogPreview";

export default function Home() {
  const [topic, setTopic] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const generateBlog = async () => {
    setLoading(true);
    try {
      console.log("Generate button clicked!");
      const res = await axios.post("http://localhost:5001/api/generate", {
        topic,
      });
      console.log("API Response:", res.data);
      setContent(res.data.content);
    } catch (error) {
      console.error("Error generating blog:", error);
    }
    setLoading(false);
  };

  const generateImage = async () => {
    setImageLoading(true);
    setImageUrl("");
    try {
      const res = await axios.post("http://localhost:5001/api/generate-image", {
        topic,
      });
      setImageUrl(res.data.imageUrl);
    } catch (error) {
      console.error("Error generating image:", error);
    }
    setImageLoading(false);
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
      <div style={{ display: "flex", gap: "10px" }}>
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
        <button
          onClick={generateImage}
          style={{
            padding: "10px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            cursor: "pointer",
            borderRadius: "5px",
          }}
          disabled={imageLoading} // ✅ Disable button while loading
        >
          {imageLoading ? "Generating Image..." : "Generate Image"}
        </button>
      </div>

      {/* {imageLoading && (
        <p style={{ marginTop: "10px", color: "#555" }}>
          ⏳ Generating image, please wait...
        </p>
      )} */}

      {imageUrl && (
        <img
          src={imageUrl}
          alt="Generated Image"
          style={{
            width: "100%",
            maxHeight: "400px",
            objectFit: "cover",
            borderRadius: "10px",
            marginTop: "20px",
          }}
        />
      )}

      <BlogPreview title={topic} content={content} />
    </div>
  );
}
