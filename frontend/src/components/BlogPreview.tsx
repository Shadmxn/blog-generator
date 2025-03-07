export default function BlogPreview({
  title,
  content,
}: {
  title: string;
  content: string;
}) {
  return (
    <div
      style={{
        marginTop: "20px",
        padding: "20px",
        border: "1px solid #ddd",
        background: "#fff",
        borderRadius: "8px",
        lineHeight: "1.8",
        fontSize: "18px",
        color: "#222",
      }}
    >
      <h2 style={{ fontSize: "24px", marginBottom: "10px", color: "#000" }}>
        {title}
      </h2>
      <div
        style={{ color: "#222" }}
        dangerouslySetInnerHTML={{
          __html: content.replace(/<p>/g, '<p style="margin-bottom: 16px;">'),
        }}
      />
    </div>
  );
}
