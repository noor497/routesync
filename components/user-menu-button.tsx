"use client"
import { useSession, signIn, signOut } from "next-auth/react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function UserMenuButton() {
  const { data: session, status } = useSession();
  const user = session?.user;
  const initials = user?.email ? user.email.split("@")[0].split(" ").map(n => n[0]).join("").toUpperCase() : "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center cursor-pointer text-lg font-bold">
          {initials}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        {user ? (
          <>
            <DropdownMenuGroup>
              <DropdownMenuItem className="flex flex-col items-start">
                <span className="font-semibold">{user.name || user.email}</span>
                <span className="text-xs text-gray-500">{user.email}</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut()}>Logout</DropdownMenuItem>
          </>
        ) : (
          <DropdownMenuItem onClick={() => signIn()}>Login</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
