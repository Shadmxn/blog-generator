export default function BlogPreview({
  title,
  content,
}: {
  title: string;
  content: string;
}) {
  return (
    <div
      style={{ marginTop: "20px", padding: "10px", border: "1px solid #ddd" }}
    >
      <h2>{title}</h2>
      <p dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
}
