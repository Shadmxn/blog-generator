"use client";
import { useState } from "react";
import axios from "axios";
import BlogPreview from "@/components/BlogPreview";

export default function Home() {
  const [topic, setTopic] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [selectedFont, setSelectedFont] = useState("Arial"); // ✅ Default font

  const generateBlog = async () => {
    setLoading(true);
    try {
      console.log("Generating blog and image...");
      const res = await axios.post("http://localhost:5001/api/generate", {
        topic,
      });
      console.log("API Response:", res.data);
      setContent(res.data.content);
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
        fontFamily: selectedFont,
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

      {/* Font Selector Dropdown */}
      <label style={{ marginRight: "10px" }}>Choose a Font:</label>
      <select
        value={selectedFont}
        onChange={(e) => setSelectedFont(e.target.value)}
        style={{ padding: "5px", marginBottom: "10px" }}
      >
        <option value="Arial">Arial</option>
        <option value="Georgia">Georgia</option>
        <option value="Times New Roman">Times New Roman</option>
        <option value="Verdana">Verdana</option>
        <option value="'Courier New', Courier, monospace">Courier New</option>
      </select>

      <button
        onClick={generateBlog}
        style={{
          padding: "10px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          cursor: "pointer",
          borderRadius: "5px",
          display: "block",
          marginTop: "10px",
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

      <BlogPreview
        title={topic}
        content={content}
        imageUrl={imageUrl}
        selectedFont={selectedFont}
      />
    </div>
  );
}
