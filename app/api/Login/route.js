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
        console.log("VALUES : ", userData);
        //Confirm data exists
        if (!userData?.email || !userData.password) {
            return NextResponse.json(
                { message: "All fields are required." },
                { status: 400 }
            );
        }
        await dbConnect();
        const foundUser = await User.findOne({ email: userData.email })
            .lean()
            .exec();

        if (!foundUser) {
            return NextResponse.json({ message: "Email not registered", }, { status: 409 });
        }
        else if (foundUser && foundUser.type == "google"){
            return NextResponse.json({ message: "Email registered through other method!", }, { status: 409 });
        }
        else if (foundUser) {
            const match = await bcrypt.compare(
                userData.password,
                foundUser.password
            );
            if (!match) {
                return NextResponse.json({ message: "Incorrect Password", }, { status: 409 });
            }
        }
        return NextResponse.json({ message: "Authorized", }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Error", error }, { status: 500 });
    }
}