"use client";

import { useEffect, useState } from "react";

export default function Dashboard() {
  const [blogs, setBlogs] = useState([]);
  const [visibleCount, setVisibleCount] = useState(9);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/blogs");
        const data = await res.json();
        setBlogs(data);
      } catch (err) {
        console.error("Failed to fetch blogs:", err);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <main className="min-h-screen bg-[#0d1117] text-white px-6 py-16">
      <div className="max-w-7xl mx-auto flex items-center justify-between mb-10 px-2">
        <a
          href="/"
          className="text-sm text-blue-400 hover:underline border border-[#30363d] px-4 py-2 rounded-lg hover:bg-[#1c2128]"
        >
          ← Back to Home
        </a>
        <h1 className="text-3xl sm:text-4xl font-bold text-white text-center flex-1 ml-[-2rem]">
          Blog Dashboard
        </h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
        {blogs.slice(0, visibleCount).map((blog, i) => (
          <a
            key={i}
            href={blog.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#161b22] border border-[#30363d] p-6 rounded-xl hover:bg-[#1c2128] transition-colors"
          >
            <h2 className="text-lg font-semibold break-all mb-2">
              {blog.name
                .replace(/\.html$/, "")
                .replace(/^\d{4}-\d{2}-\d{2}-/, "")
                .replace(/-/g, " ")
                .replace(/\b\w/g, (l) => l.toUpperCase())}
            </h2>
            <p className="text-sm text-blue-400">View Blog →</p>
          </a>
        ))}
      </div>

      {visibleCount < blogs.length && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => setVisibleCount((prev) => prev + 6)}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
          >
            Load More
          </button>
        </div>
      )}
    </main>
  );
}
