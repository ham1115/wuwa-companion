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
  /*
   * What the phone paints around the page: the status bar on iOS, the
   * address bar on Android. It was a single dark navy, which belongs to
   * neither theme and matched nothing in the app. These are --bg from each.
   */
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fff6fa" },
    { media: "(prefers-color-scheme: dark)", color: "#1c1118" },
  ],
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
        <ClerkProvider>{children}</ClerkProvider>
      </body>
    </html>
  );
}
