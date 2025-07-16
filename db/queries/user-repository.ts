import { db } from ".."
import { usersTable } from "../schema"
import { eq } from "drizzle-orm"

export async function getUsers() {
  return db.query.usersTable.findMany()
}

export async function updateUserRole(userId: string, role: "user" | "admin") {
  return db.update(usersTable).set({ role }).where(eq(usersTable.id, userId))
} 