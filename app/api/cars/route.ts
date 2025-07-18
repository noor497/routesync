import { NextResponse } from "next/server";
import Car from "@/app/(models)/Car";
import  dbConnect  from "@/lib/mongodb";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  await dbConnect();
  try {
    if (slug) {
      const car = await Car.findOne({ _id: slug }).lean();
      if (!car) {
        return NextResponse.json({ error: "Car not found" }, { status: 404 });
      }
      return NextResponse.json(car);
    } else {
      const cars = await Car.find({}).lean();
      return NextResponse.json(cars);
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch car(s)" }, { status: 500 });
  }
} 