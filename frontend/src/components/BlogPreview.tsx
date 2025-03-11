export default function BlogPreview({
  title,
  content,
  imageUrl,
}: {
  title: string;
  content: string;
  imageUrl?: string;
}) {
  return (
    <div
      style={{
        marginTop: "20px",
        padding: "25px",
        border: "1px solid #ddd",
        background: "#fff",
        borderRadius: "10px",
        lineHeight: "1.8",
        fontSize: "18px",
        color: "#222",
        maxWidth: "800px",
        marginLeft: "auto",
        marginRight: "auto",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h2
        style={{
          fontSize: "28px",
          marginBottom: "15px",
          color: "#000",
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        {title}
      </h2>

      {imageUrl && (
        <img
          src={imageUrl}
          alt="Generated Image"
          style={{
            width: "100%",
            maxHeight: "400px",
            objectFit: "cover",
            borderRadius: "10px",
            marginBottom: "20px",
          }}
        />
      )}

      <div
        style={{ color: "#222" }}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}
