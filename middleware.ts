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
/**
 * `frontendApiProxy` serves Clerk's Frontend API from this app's own origin at
 * `/__clerk`, instead of the browser talking to `accounts.dev` directly.
 *
 * Without it, every cold load on a development instance is a handshake: a 307
 * out to `<slug>.clerk.accounts.dev/v1/client/handshake` and back, which is the
 * out-and-back shape iOS Safari's bounce-tracking protection exists to punish.
 * Same-origin, there is nothing cross-site left to bounce through.
 *
 * Clerk ships this for exactly our situation — its auto-enable list is
 * `['.vercel.app']` — but auto-enable also requires a production key, and ours
 * is `pk_test_`. Hence switching it on by hand. The matching `proxyUrl` on
 * `<ClerkProvider>` is what points the browser at the proxy; this half only
 * answers it.
 */
export default clerkMiddleware({ frontendApiProxy: { enabled: true } });

export const config = {
  matcher: [
    // Everything except Next internals and static files.
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes.
    "/(api|trpc)(.*)",
  ],
};
