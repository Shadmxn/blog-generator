"use client";
import { useState } from "react";
import axios from "axios";
import BlogPreview from "@/components/BlogPreview";
import ReferenceBlog from "@/components/ReferenceBlog";

export default function Home() {
  const [topic, setTopic] = useState("");
  const [content, setContent] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [reference, setReference] = useState("");

  const generateBlog = async () => {
    setLoading(true);
    try {
      console.log("Generating blog and image...");
      const res = await axios.post("http://localhost:5001/api/generate", {
        topic,
        reference,
      });
      console.log("API Response:", res.data);
      setContent(res.data.content);
      setFeaturedImage(res.data.featuredImage);
    } catch (error) {
      console.error("Error generating blog:", error);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
      <h1>AI Blog Generator</h1>

      <input
        type="text"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="Enter blog topic"
        style={{
          padding: "10px",
          width: "100%",
          marginBottom: "10px",
          borderRadius: "5px",
          border: "1px solid #ccc",
        }}
      />

      <ReferenceBlog setReference={setReference} />

      {/* ✅ Reapply Button Styling */}
      <button
        onClick={generateBlog}
        disabled={loading}
        style={{
          padding: "12px 20px",
          backgroundColor: loading ? "#ccc" : "#007bff",
          color: "white",
          border: "none",
          cursor: loading ? "not-allowed" : "pointer",
          borderRadius: "5px",
          marginTop: "10px",
          fontSize: "16px",
          fontWeight: "bold",
          transition: "background-color 0.3s ease",
        }}
      >
        {loading ? "Generating..." : "Generate Blog"}
      </button>

      {loading && (
        <p style={{ marginTop: "10px", color: "#555" }}>
          ⏳ Please wait, generating blog...
        </p>
      )}

      <BlogPreview
        title={topic}
        content={content}
        featuredImage={featuredImage}
      />
    </div>
  );
}
