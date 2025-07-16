import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { options } from "../api/auth/[...nextauth]/route";

export default async function AuthLayout({ children }) {
  const session = await getServerSession(options);
  if (session) {
    redirect("/");
  }
  return <>{children}</>;
}

