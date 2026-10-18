import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { BackgroundCanvasLoader } from "@/components/background/BackgroundCanvasLoader";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { site } from "@/lib/content";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: site.title,
  description: site.description,
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
        <BackgroundCanvasLoader />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
