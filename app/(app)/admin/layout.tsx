import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import User from "@/app/(models)/User";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(options);
  const userEmail = session?.user?.email;
  let isAdmin = false;
  if (userEmail) {
    const user = await User.findOne({ email: userEmail });
    if (user?.role === "admin") isAdmin = true;
  }
  if (!isAdmin) {
    redirect("/");
  }
  return <>{children}</>;
} 