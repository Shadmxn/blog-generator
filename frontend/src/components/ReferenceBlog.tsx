import { useState } from "react";

export default function ReferenceBlog({
  setReference,
}: {
  setReference: (ref: string) => void;
}) {
  const [text, setText] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    setReference(e.target.value); // Pass reference text to parent
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <h3>Paste a Reference Blog</h3>
      <textarea
        value={text}
        onChange={handleChange}
        placeholder="Paste a blog post here..."
        rows={6}
        style={{
          width: "100%",
          padding: "10px",
          borderRadius: "5px",
          border: "1px solid #ccc",
          fontFamily: "Arial",
          fontSize: "16px",
        }}
      />
    </div>
  );
}
