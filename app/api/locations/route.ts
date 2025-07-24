import { NextResponse } from "next/server";
import { locations } from "@/data/locations";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.toLowerCase() || "";
  const filtered = q
    ? locations.filter((loc) => loc.name.toLowerCase().includes(q))
    : locations;
  return NextResponse.json(filtered);
} 