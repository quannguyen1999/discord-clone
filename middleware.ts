import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
// Define routes that should be protected
// const isProtectedRoute = createRouteMatcher([
//     '/' // Add any additional routes here
//   ]);// Update clerkMiddleware to manually protect routes
const isPublicRoute = createRouteMatcher(['/api/uploadthing']);

export default clerkMiddleware((auth, req) => {
    if (!isPublicRoute(req)) {
      auth().protect(); // Protect the route if it matches the defined criteria
    }
});


export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};