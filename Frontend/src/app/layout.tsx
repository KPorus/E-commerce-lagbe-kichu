import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const JosefinSans = localFont({
  src: [
    {
      path: "./fonts/static/JosefinSans-Regular.ttf",
      weight: "400",
    },
    {
      path: "./fonts/static/JosefinSans-Bold.ttf",
      weight: "700",
    },
    {
      path: "./fonts/static/JosefinSans-Medium.ttf",
      weight: "500",
    },
    {
      path: "./fonts/static/JosefinSans-Light.ttf",
      weight: "300",
    },
    {
      path: "./fonts/static/JosefinSans-SemiBold.ttf",
      weight: "600",
    }
  ],
  variable: "--font-josefin-sans",
});

export const metadata: Metadata = {
  title: "Lagbe Kichu",
  description: "E-commerce website for Lagbe Kichu",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${JosefinSans.variable} antialiased`}>{children}</body>
    </html>
  );
}
