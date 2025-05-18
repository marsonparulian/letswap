import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SiteNav from "@/app/ui/site-nav";
import ToasterWrapper from "@/app/ui/ToasterWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LetSwap",
  description:
    "Let's swap our collectibles! Promos, freebies, merch, giveaway, and all !",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ToasterWrapper />

        {/* Navigation */}
        <header className="site-header">
          <SiteNav />
        </header>

        {/* Main Content Area */}
        <div className="main-content">
          <main className="grid-container">
            <div className="grid-x grid-margin-x">
              <div className="cell">{children}</div>
            </div>
          </main>
        </div>

        {/* Footer */}
        <footer className="site-footer">
          <div className="grid-container">
            <div className="grid-x grid-margin-x">
              <div className="cell text-center">
                <p>© {new Date().getFullYear()} LetSwap. Happy collecting!</p>
              </div>
            </div>
          </div>
        </footer>

        {/* Foundation CSS */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/foundation-sites@6.9.0/dist/css/foundation.min.css"
        />

        {/* JQuery JS */}
        <script
          defer
          type="text/javascript"
          src="https://code.jquery.com/jquery-3.7.0.min.js"
        ></script>

        {/* Foundation JS */}
        <script
          defer
          type="text/javascript"
          src="https://cdn.jsdelivr.net/npm/foundation-sites@6.9.0/dist/js/foundation.min.js"
        ></script>
      </body>
    </html>
  );
}
