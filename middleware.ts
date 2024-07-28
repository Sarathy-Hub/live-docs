import { clerkMiddleware } from "@clerk/nextjs/server";

// Update matcher to include `/sign-in` route
export default clerkMiddleware();

export const config = {
  matcher: [
    "/((?!.*\\..*|_next).*)", // Match all routes except for files and `_next` paths
    "/sign-in",                // Explicitly include `/sign-in` route
    "/(api|trpc)(.*)"          // Match API routes
  ],
};
