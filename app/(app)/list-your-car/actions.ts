"use server"
import mongoose from "mongoose"
import Car from "@/app/(models)/Car"
import  dbConnect  from "@/lib/mongodb";
// const MONGODB_URI = process.env.MONGODB_URI;
// async function connectMongoose() {
//   if (mongoose.connection.readyState === 0) {
//     await mongoose.connect(MONGODB_URI!);
//   }
// }

export async function insertCarToMongo(car: {
  name: string;
  type: string;
  seats: number;
  powertrain: string;
  transmission: string;
  unlimitedMileage: boolean;
  description: string;
  features: string[];
  imageUrls: string[];
  pricePerDay: number;
  user: string; // user id
  userEmail: string;
}) {
  try {
    await dbConnect();
    const doc = {
      name: car.name,
      bodyStyle: car.type,
      seats: Number(car.seats),
      powertrain: car.powertrain,
      transmission: car.transmission,
      unlimitedMileage: !!car.unlimitedMileage,
      description: car.description,
      features: car.features,
      imageUrls: car.imageUrls,
      pricePerDay: car.pricePerDay,
      user: car.user, // store user id
      userEmail: car.userEmail,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const createdCar = await Car.create(doc);
    return { success: true, car: createdCar };
  } catch (error) {
     return { success: false, error: error instanceof Error ? error.message : "An unknown error occurred" };
  }
}

export async function getCarsByUserEmail(userEmail: string) {
  try {
    await dbConnect();
    const cars = await Car.find({ userEmail }).sort({ createdAt: -1 }).lean();
    console.log(cars);
    return { success: true, cars };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "An unknown error occurred" };
  }
} 