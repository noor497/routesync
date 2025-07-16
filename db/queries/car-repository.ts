import { eq } from "drizzle-orm"

import { db } from ".."
import { SelectCar } from "../schema"

// Import mongoose and Car model using require for CommonJS compatibility
// const mongoose = require('mongoose');
// const Car = require('../../app/(models)/Car.js');
import mongoose from "mongoose";
import Car from "../../app/(models)/Car.js";

// const MONGODB_URI = process.env.MONGODB_URI;
// async function connectMongoose() {
//   if (mongoose.connection.readyState === 0) {
//     await mongoose.connect(MONGODB_URI as string);
//   }
// }

export async function getCars() {
  // Fetch from SQL
  const sqlCars = await db.query.carsTable.findMany();

  // Fetch from MongoDB
  // await connectMongoose();
  const mongoCars = await Car.find({}).lean();

  // Merge arrays (optionally, you can normalize fields if needed)
  return [ ...mongoCars];
}

export async function getCarBySlug(slug: SelectCar["slug"]) {
  // Try MongoDB first
  // await connectMongoose();
  const mongoCar = await Car.findOne({ _id: slug }).lean();
  console.log("mongoCar", mongoCar, slug);
  if (mongoCar) return mongoCar;

  // Fallback to SQL
  return db.query.carsTable.findFirst({
    where: (fields, operators) => eq(fields.slug, slug),
  });
}
