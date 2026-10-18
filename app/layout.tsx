import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { MotionEffects } from "@/components/motion-effects";
import { ThemeProvider } from "@/components/theme-provider";
import { site } from "@/content/site";
import { handleFromUrl } from "@/lib/content";
import "./globals.css";
import "./motion.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "spacexbt", template: "%s | spacexbt" },
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: { type: "website", siteName: "spacexbt", url: site.url },
  twitter: {
    card: "summary_large_image",
    creator: handleFromUrl(site.links.x),
    site: handleFromUrl(site.links.x),
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body className="font-sans">
        <ThemeProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-surface focus:px-3 focus:py-2 focus:text-sm focus:text-text focus:ring-1 focus:ring-border"
          >
            Skip to content
          </a>
          <Header />
          {children}
          <Footer />
          <MotionEffects />
        </ThemeProvider>
        {process.env.VERCEL ? <Analytics /> : null}
      </body>
    </html>
  );
}
