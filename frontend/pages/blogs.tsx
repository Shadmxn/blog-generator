import { useEffect, useState } from "react";

type BlogFile = {
  name: string;
  url: string;
};

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<BlogFile[]>([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      const res = await fetch("http://localhost:5001/api/blogs");
      const data = await res.json();
      setBlogs(data);
    };
    fetchBlogs();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>All Blogs</h1>
      <ul>
        {blogs.map((blog) => (
          <li key={blog.name}>
            <a href={blog.url} target="_blank" rel="noopener noreferrer">
              {blog.name
                .replace(".html", "")
                .replace(/^\d{4}-\d{2}-\d{2}-/, "")
                .replace(/-/g, " ")}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
