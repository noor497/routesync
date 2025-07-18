import { NextResponse } from "next/server"
import { updateUserRole } from "@/db/queries/user-repository"
import  dbConnect  from "@/lib/mongodb";
export async function POST(req: Request) {
  const formData = await req.formData()
  const userId = formData.get("userId") as string
  const role = formData.get("role") as "user" | "admin"

  if (!userId || !role) {
    return NextResponse.json({ error: "Missing userId or role" }, { status: 400 })
  }

  try {
    await dbConnect();
    await updateUserRole(userId, role)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update role" }, { status: 500 })
  }
} 