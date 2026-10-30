import { clerkMiddleware } from "@clerk/nextjs/server";

/**
 * Signing in is optional here, so nothing is protected at this layer: the app
 * has to stay completely usable signed out, which is what makes the URL worth
 * sharing. The middleware only makes the session available to routes that ask
 * for it; `app/api/state` is what actually refuses anonymous callers.
 *
 * (Next 15 reads this file as `middleware.ts`. Next 16 renames it `proxy.ts`
 * and exports `proxy` instead.)
 */
export default clerkMiddleware();

export const config = {
  matcher: [
    // Everything except Next internals and static files.
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes.
    "/(api|trpc)(.*)",
  ],
};
