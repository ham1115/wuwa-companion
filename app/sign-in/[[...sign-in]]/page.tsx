import { Suspense } from "react";
import { SignIn } from "@clerk/nextjs";

/**
 * Suspense because a catch-all Clerk component reads the request, which
 * `next build` refuses outside a boundary once cache components are on.
 */
export default function Page() {
  return (
    <main className="shell auth-shell">
      <Suspense fallback={<p className="empty">Loading sign in…</p>}>
        <SignIn />
      </Suspense>
    </main>
  );
}
