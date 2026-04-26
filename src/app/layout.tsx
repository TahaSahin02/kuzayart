import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "KuzayArt — Original Oil Paintings by Didem Kuzay",
  description:
    "Discover and collect original oil paintings by Didem Kuzay. Dramatic seascapes and landscapes painted with passion.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={`${geistSans.variable} ${cormorant.variable} antialiased`}
    >
      <body className="min-h-screen flex flex-col bg-[#0a0a0a] text-[#f0ece4]">
        {children}
      </body>
    </html>
  );
}
