import { Suspense } from "react";
import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <main className="shell auth-shell">
      <Suspense fallback={<p className="empty">Loading sign up…</p>}>
        <SignUp />
      </Suspense>
    </main>
  );
}
