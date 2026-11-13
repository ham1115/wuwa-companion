import type { Metadata, Viewport } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Chakra_Petch } from "next/font/google";
import "./globals.css";

/*
 * The one display face: character names, stats and counts, nothing else.
 * Its corners are cut the way the panels are, which is why it was picked over
 * a rounder face. Self-hosted by next/font, so no request goes to Google at
 * runtime, and it is only two weights.
 */
const display = Chakra_Petch({
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "Resonance Codex",
  description:
    "A Wuthering Waves companion: glossary, build tracker, story progress, and a daily routine.",
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
    <html lang="en" className={display.variable}>
      {/* Current Clerk SDKs want the provider inside <body>, not around <html>. */}
      <body>
        <ClerkProvider>{children}</ClerkProvider>
      </body>
    </html>
  );
}
