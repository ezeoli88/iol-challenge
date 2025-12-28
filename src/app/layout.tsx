
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import React from "react";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata = {
  title: "Currency Converter",
  description: "A professional currency converter application using Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className} ${inter.variable} ${poppins.variable}`}>
        {children}
      </body>
    </html>
  );
}
