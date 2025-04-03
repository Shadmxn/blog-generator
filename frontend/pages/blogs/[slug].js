// frontend/pages/blogs/[slug].js
import React from "react";

export async function getServerSideProps(context) {
  const { slug } = context.params;
  const url = `https://blog-ai-bucket.s3.amazonaws.com/${slug}.html`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      return { notFound: true };
    }
    const html = await response.text();

    return {
      props: {
        html,
      },
    };
  } catch (err) {
    console.error("Error fetching blog HTML:", err);
    return { notFound: true };
  }
}

export default function BlogPage({ html }) {
  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
