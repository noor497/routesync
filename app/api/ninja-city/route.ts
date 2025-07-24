import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";
  const apiKey = process.env.NINJA_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Missing Ninja API key" }, { status: 500 });
  }
  const url = `https://api.api-ninjas.com/v1/city?name=${encodeURIComponent(q)}`;
  const res = await fetch(url, {
    headers: { "X-Api-Key": apiKey },
  });
  if (!res.ok) {
    return NextResponse.json({ error: "Failed to fetch from Ninja City API" }, { status: 500 });
  }
  const data = await res.json();
  return NextResponse.json(data);
} 