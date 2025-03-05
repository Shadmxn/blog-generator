import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { topic } = await req.json();

  const res = await fetch("http://localhost:5000/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topic }),
  });

  const data = await res.json();
  return NextResponse.json({ content: data.content });
}
