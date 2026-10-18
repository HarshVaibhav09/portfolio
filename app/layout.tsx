import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { BackgroundCanvasLoader } from "@/components/background/BackgroundCanvasLoader";
import { BackToTop } from "@/components/layout/BackToTop";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { profile, site, ui } from "@/lib/content";
import { getSiteUrl } from "@/lib/site-url";
import { personJsonLd, serializeJsonLd } from "@/lib/structured-data";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Open Graph and Twitter images come from app/opengraph-image.tsx and app/twitter-image.tsx.
export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: { default: site.title, template: `%s | ${site.name}` },
  description: site.description,
  keywords: [...site.keywords],
  authors: [{ name: profile.name, url: getSiteUrl() }],
  creator: profile.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: site.name,
    title: site.title,
    description: site.description,
    locale: site.locale,
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
};

// Mobile browser chrome matches the default (dark) page background, --bg in globals.css.
export const viewport: Viewport = {
  themeColor: "#0F0F1E",
};

// Runs during HTML parsing, before first paint, so a saved light theme never flashes dark.
const themeScript = `(function(){try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {/* Without JS the scroll reveals never run, so show everything */}
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      {/* suppressHydrationWarning: browser extensions inject attributes onto <body> */}
      <body suppressHydrationWarning>
        {/* First focusable element: lets keyboard users jump past the navbar */}
        <a
          href="#main"
          className="sr-only rounded-full bg-bg-alt font-medium text-text shadow-lg focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[70] focus:px-5 focus:py-3"
        >
          {ui.skipToContent}
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(personJsonLd()) }}
        />
        <BackgroundCanvasLoader />
        <Navbar />
        {children}
        <Footer />
        <BackToTop />
      </body>
    </html>
  );
}
