import User from "../../(models)/User";
import { NextResponse } from "next/server";
// import bcrypt from "bcrypt";
import bcrypt from "bcryptjs";
import  dbConnect  from "@/lib/mongodb";

export async function POST(req) {
  try {
   
    const body = await req.json();
    const userData = body.values;
    userData.type = "credentials";
    console.log("VALUES : ",userData);
    //Confirm data exists
    if (!userData?.email || !userData.password) {
      return NextResponse.json(
        { message: "All fields are required." },
        { status: 400 }
      );
    }
    await dbConnect();
    // check for duplicate emails
    const duplicate = await User.findOne({ email: userData.email })
      .lean()
      .exec();

    if (duplicate) {
      return NextResponse.json({ message: "Email already registered", }, { status: 409 });
    }

    const hashPassword = await bcrypt.hash(userData.password, 10);
    userData.password = hashPassword;

    await User.create(userData);
    return NextResponse.json({ message: "User Created Successfully." }, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}

export async function GET(req) {
  try {
   
    const body = await req.json();
    const userData = body.values;
    userData.type = "credentials";
    console.log("VALUES : ",userData);
    //Confirm data exists
    if (!userData?.email || !userData.password) {
      return NextResponse.json(
        { message: "All fields are required." },
        { status: 400 }
      );
    }
    await dbConnect();
    // check for duplicate emails
    const duplicate = await User.findOne({ email: userData.email })
      .lean()
      .exec();

    if (duplicate) {
      return NextResponse.json({ message: "Email already registered", }, { status: 409 });
    }

    const hashPassword = await bcrypt.hash(userData.password, 10);
    userData.password = hashPassword;

    await User.create(userData);
    return NextResponse.json({ message: "User Created Successfully." }, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}