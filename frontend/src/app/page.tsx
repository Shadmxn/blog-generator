"use client";

import axios from "axios";
import BlogPreview from "@/components/BlogPreview";
import ReferenceBlog from "@/components/ReferenceBlog";
import { Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loadAuth, clearAuth } from "@/utils/authService";

export default function Home() {
  const router = useRouter();
  const [topic, setTopic] = useState("");
  const [generatedTitle, setGeneratedTitle] = useState("");
  const [content, setContent] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [reference, setReference] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = loadAuth();
    if (auth?.user) {
      setUser(auth.user);
    }
  }, []);

  const generateBlog = async () => {
    if (!user) {
      alert("Please log in to generate a blog.");
      router.push("/login");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5001/api/generate", {
        topic,
        reference,
      });
      setGeneratedTitle(res.data.title);
      setContent(res.data.content);
      setFeaturedImage(res.data.featuredImage);
    } catch (error) {
      console.error("Error generating blog:", error);
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-[#0d1117] text-white px-6 pt-20 pb-20 flex flex-col items-center">
      {/* Logo/Header */}
      <header className="w-full max-w-7xl flex justify-between items-center mb-16 px-4">
        <div className="text-xl font-semibold flex items-center gap-2">
          <span className="text-white">📘</span>
          <span className="text-white">BlogGenius</span>
        </div>

        <div className="flex items-center gap-6">
          <nav className="hidden sm:flex gap-10 text-sm text-gray-300">
            <a href="#">Home</a>
            <a href="#">Examples</a>
            <a href="#">How It Works</a>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (user) {
                  router.push("/dashboard");
                } else {
                  alert("Please log in to access the dashboard.");
                  router.push("/login");
                }
              }}
              className="text-blue-400 hover:underline"
            >
              Dashboard
            </a>
          </nav>

          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-300">Hi, {user.email}</span>
              <button
                onClick={() => {
                  clearAuth();
                  setUser(null);
                }}
                className="text-sm text-red-400 hover:underline"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => router.push("/signup")}
              className="text-sm text-blue-400 hover:underline"
            >
              Get Started
            </button>
          )}
        </div>
      </header>

      {/* Title and Subtext */}
      <div className="text-center mb-14 px-4">
        <h1 className="text-5xl font-bold mb-4 leading-tight">
          Generate Amazing Blog Content
        </h1>
        <p className="text-gray-400 text-lg sm:text-xl max-w-3xl mx-auto">
          Enter a topic or idea, and our AI will generate a well-structured blog
          post for you in seconds.
        </p>
      </div>

      {/* Input Form */}
      <div className="w-full max-w-4xl bg-[#161b22] border border-[#30363d] rounded-2xl p-8 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">Blog Generator</h2>
          <button
            onClick={() => alert("Prompt guide coming soon")}
            className="text-sm text-blue-400 hover:underline"
          >
            Show Tips
          </button>
        </div>

        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="E.g., 'Best ways to budget every paycheck'"
          className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg p-4 text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
        />

        <ReferenceBlog setReference={setReference} />

        <p className="text-sm text-gray-400 mt-2">
          Be specific for better results. Try to include the target audience,
          tone, and key points.
        </p>

        <div className="flex gap-4 mt-5">
          <button
            onClick={generateBlog}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm font-medium disabled:opacity-50"
          >
            <Sparkles className="h-4 w-4" />
            {loading ? "Generating..." : "Generate Blog"}
          </button>
          <button
            onClick={() => {
              setTopic("");
              setContent("");
              setFeaturedImage("");
              setGeneratedTitle("");
              setReference("");
            }}
            className="px-5 py-2.5 border border-gray-500 text-white rounded-lg text-sm hover:bg-gray-800"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Blog Preview */}
      {content && (
        <div className="w-full max-w-4xl bg-[#161b22] border border-[#30363d] rounded-2xl p-8 mt-12 shadow-lg">
          <BlogPreview
            title={generatedTitle}
            content={content}
            featuredImage={featuredImage}
          />
        </div>
      )}
    </main>
  );
}
