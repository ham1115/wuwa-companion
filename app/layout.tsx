import type { Metadata, Viewport } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: "Resonance Codex",
  description:
    "A Wuthering Waves companion: glossary, build tracker, story progress and a daily routine.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0b0f14",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* Current Clerk SDKs want the provider inside <body>, not around <html>. */}
      <body>
        {/* Relative on purpose: resolved against the current origin, so the
            same value works on localhost, previews and production. Pairs with
            `frontendApiProxy` in middleware.ts. */}
        <ClerkProvider proxyUrl="/__clerk">{children}</ClerkProvider>
      </body>
    </html>
  );
}
