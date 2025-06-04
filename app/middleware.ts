import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequestWithAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(request: NextRequestWithAuth) {
    const token = request.nextauth.token;
    const path = request.nextUrl.pathname;

    // Skip profile check for authentication and profile routes
    if (path.startsWith("/auth/") || path.startsWith("/profile/")) {
      return NextResponse.next();
    }

    // If logged in but profile incomplete, redirect to profile completion
    if (token && !token.isProfileComplete) {
      const profileUrl = new URL("/profile/complete", request.url);
      // Store the original URL to redirect back after profile completion
      profileUrl.searchParams.set("callbackUrl", request.url);
      return NextResponse.redirect(profileUrl);
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    // Match all routes except:
    // - API routes
    // - Static files
    // - Public files
    // - Auth routes
    "/((?!api|_next/static|_next/image|favicon.ico|auth/signin|auth/error).*)",
  ],
};
