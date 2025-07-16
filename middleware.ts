// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequestWithAuth } from "next-auth/middleware";

// Define public routes here
const PUBLIC_PATHS = new Set(["/", "/login", "/signup", "/about"]);

function isPublic(path: string): boolean {
  return PUBLIC_PATHS.has(path);
}

export default withAuth(
  async function middleware(req: NextRequestWithAuth) {
    const { pathname } = req.nextUrl;
    console.log("pathname", pathname);
    const token = req.nextauth.token;

    // If authenticated and trying to visit /login or /signup, redirect to home
    if (token && (pathname === '/login' || pathname === '/signup')) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    // If this route is public, skip auth logic entirely
    if (isPublic(pathname)) {
      return NextResponse.next();
    }

    // If not public and no token, redirect to login
    if (!token) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = "/login";
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Otherwise, allow navigation
    return NextResponse.next();
  },
  {
    pages: { signIn: "/login" },
    callbacks: {
      authorized: () => true  // Actual logic is handled above
    }
  }
);

// Only apply middleware to non-public, non-asset, non-api routes
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)"
  ]
}
