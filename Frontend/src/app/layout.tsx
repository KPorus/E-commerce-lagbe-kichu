import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import StoreProvider from "./StoreProvider";
import { Provider } from "@/components/ui/provider";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "./authProvider";
import { getRefreshTokenFromServer, } from "@/utils/getRefreshToken";

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
    },
  ],
  variable: "--font-josefin-sans",
});

export const metadata: Metadata = {
  title: "Lagbe Kichu",
  description: "E-commerce website for Lagbe Kichu",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const refreshToken = getRefreshTokenFromServer();
  // console.log(refreshToken);
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${JosefinSans.variable} antialiased`}>
        <Provider>
          <Toaster />
          <StoreProvider>
            <AuthProvider refreshToken={refreshToken}>{children}</AuthProvider>
          </StoreProvider>
        </Provider>
      </body>
    </html>
  );
}
