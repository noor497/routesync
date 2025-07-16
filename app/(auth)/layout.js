import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function AuthLayout({ children }) {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect("/");
  }
  return <>{children}</>;
}

