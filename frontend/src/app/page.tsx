"use client";
import { useState } from "react";
import axios from "axios";
import BlogPreview from "@/components/BlogPreview";

export default function Home() {
  const [topic, setTopic] = useState("");
  const [content, setContent] = useState("");

  const generateBlog = async () => {
    const res = await axios.post("http://localhost:5001/api/generate", {
      topic,
    }); // Ensure this matches backend port
    setContent(res.data.content);
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
      <BlogPreview title={topic} content={content} />
    </div>
  );
}
