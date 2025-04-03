import { useEffect, useState } from "react";
import Link from "next/link";

export default function TestBlogs() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5001/api/blogs")
      .then((res) => res.json())
      .then((data) => setBlogs(data || []));
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Test Blog Page</h1>
      {blogs.length === 0 ? (
        <p>Loading blogs...</p>
      ) : (
        <ul>
          {blogs.map((blog) => {
            // Extract slug from filename
            const fileName = blog.name || blog.key;
            const slug = fileName.replace(".html", "");

            return (
              <li key={fileName}>
                <Link href={`/blogs/${slug}`}>
                  {slug.replace(/^\d{4}-\d{2}-\d{2}-/, "").replace(/-/g, " ")}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
