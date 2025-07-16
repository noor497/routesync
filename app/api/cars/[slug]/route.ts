import { NextResponse } from "next/server";
import Car from "@/app/(models)/Car";

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    const { slug } = await params;
    console.log("slug in api/cars/[slug]/route.ts", slug);
    const car = await Car.findOne({ _id: slug }).lean();
    if (!car) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 });
    }
    return NextResponse.json(car);
  } catch (error) {
    console.error("Error fetching car:", error);
    return NextResponse.json({ error: "Failed to fetch car" }, { status: 500 });
  }
} 