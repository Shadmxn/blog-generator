export default function BlogPreview({
  title,
  content,
  featuredImage,
  selectedFont,
}: {
  title: string;
  content: string;
  featuredImage: string;
  selectedFont: string;
}) {
  // ✅ Get the current date in a readable format
  const currentDate = new Date().toLocaleDateString("en-US", {
    // weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <section id="blog-post">
      <div className="container">
        <h1 className="blog-h1">{title}</h1>

        {/* ✅ Display the dynamically generated date */}
        <div className="metadata">Published on {currentDate}</div>

        {/* ✅ Display header image at the top */}
        {featuredImage && (
          <img
            src={featuredImage}
            alt="Header Image"
            className="blog-img-header"
          />
        )}

        {/* ✅ Render blog content with inline images */}
        <div
          className="blog-content"
          dangerouslySetInnerHTML={{
            __html: content
              .replace(/<h2>/g, '<h2 class="blog-h2">')
              .replace(/<h3>/g, '<h3 class="blog-h3">')
              .replace(/<h4>/g, '<h4 class="blog-h4">')
              .replace(/<p>/g, '<p class="blog-p">')
              .replace(/<img /g, '<img class="blog-img-in-p" '),
          }}
        />
      </div>
    </section>
  );
}
